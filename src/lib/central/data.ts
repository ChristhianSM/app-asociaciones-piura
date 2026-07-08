import "server-only";
import { createClient } from "@/lib/supabase/server";
import { estadoPorFechas as estadoConcurso } from "@/lib/estado";
import type { EstadoCategoria } from "@/types/domain";

export { estadoConcurso };

export interface AsociacionResumen {
  id: string;
  nombre: string;
  nombreCorto: string;
  region: string | null;
  activo: boolean;
  nConcursos: number;
  nAdmins: number;
}

export async function getAsociaciones(query?: string): Promise<AsociacionResumen[]> {
  const supabase = await createClient();

  let asocQuery = supabase
    .from("asociaciones")
    .select("id, nombre, nombre_corto, region, activo")
    .order("nombre_corto");

  if (query) {
    const term = query.replace(/[%,]/g, "");
    asocQuery = asocQuery.or(`nombre_corto.ilike.%${term}%,region.ilike.%${term}%`);
  }

  const [{ data: asociaciones }, { data: concursos }, { data: admins }] = await Promise.all([
    asocQuery,
    supabase.from("concursos").select("asociacion_id"),
    supabase.from("perfiles").select("asociacion_id").eq("rol", "admin_asociacion"),
  ]);

  const concursosPorAsoc = new Map<string, number>();
  for (const c of concursos ?? []) {
    concursosPorAsoc.set(c.asociacion_id, (concursosPorAsoc.get(c.asociacion_id) ?? 0) + 1);
  }

  const adminsPorAsoc = new Map<string, number>();
  for (const a of admins ?? []) {
    if (!a.asociacion_id) continue;
    adminsPorAsoc.set(a.asociacion_id, (adminsPorAsoc.get(a.asociacion_id) ?? 0) + 1);
  }

  return (asociaciones ?? []).map((a) => ({
    id: a.id,
    nombre: a.nombre,
    nombreCorto: a.nombre_corto,
    region: a.region,
    activo: a.activo,
    nConcursos: concursosPorAsoc.get(a.id) ?? 0,
    nAdmins: adminsPorAsoc.get(a.id) ?? 0,
  }));
}

export async function getAsociacion(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("asociaciones")
    .select("id, nombre, nombre_corto, region, activo")
    .eq("id", id)
    .single();
  return data;
}

export interface ConcursoResumen {
  id: string;
  asociacionId: string;
  asociacionNombreCorto: string;
  slug: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCategoria;
  nCategorias: number;
  nEjemplares: number;
}

export async function getConcursos(filtroAsociacionId?: string): Promise<ConcursoResumen[]> {
  const supabase = await createClient();

  let concursosQuery = supabase
    .from("concursos")
    .select("id, asociacion_id, slug, nombre, fecha_inicio, fecha_fin, asociaciones(nombre_corto)")
    .order("fecha_inicio", { ascending: false });

  if (filtroAsociacionId) {
    concursosQuery = concursosQuery.eq("asociacion_id", filtroAsociacionId);
  }

  const [{ data: concursos }, { data: categorias }] = await Promise.all([
    concursosQuery,
    supabase.from("categorias").select("id, concurso_id"),
  ]);

  const categoriaIds = (categorias ?? []).map((c) => c.id);
  const { data: ejemplares } = categoriaIds.length
    ? await supabase.from("ejemplares").select("categoria_id").in("categoria_id", categoriaIds)
    : { data: [] as { categoria_id: string }[] };

  const categoriasPorConcurso = new Map<string, string[]>();
  for (const c of categorias ?? []) {
    const lista = categoriasPorConcurso.get(c.concurso_id) ?? [];
    lista.push(c.id);
    categoriasPorConcurso.set(c.concurso_id, lista);
  }

  const ejemplaresPorCategoria = new Map<string, number>();
  for (const e of ejemplares ?? []) {
    ejemplaresPorCategoria.set(e.categoria_id, (ejemplaresPorCategoria.get(e.categoria_id) ?? 0) + 1);
  }

  return (concursos ?? []).map((c) => {
    const cats = categoriasPorConcurso.get(c.id) ?? [];
    const nEjemplares = cats.reduce((sum, catId) => sum + (ejemplaresPorCategoria.get(catId) ?? 0), 0);
    const asociacion = c.asociaciones as unknown as { nombre_corto: string } | null;
    return {
      id: c.id,
      asociacionId: c.asociacion_id,
      asociacionNombreCorto: asociacion?.nombre_corto ?? "",
      slug: c.slug,
      nombre: c.nombre,
      fechaInicio: c.fecha_inicio,
      fechaFin: c.fecha_fin,
      estado: estadoConcurso(c.fecha_inicio, c.fecha_fin),
      nCategorias: cats.length,
      nEjemplares,
    };
  });
}

export async function getResumenGlobal() {
  const supabase = await createClient();

  const [{ count: nAsociaciones }, { count: nAsociacionesActivas }, { count: nEjemplares }] =
    await Promise.all([
      supabase.from("asociaciones").select("*", { count: "exact", head: true }),
      supabase.from("asociaciones").select("*", { count: "exact", head: true }).eq("activo", true),
      supabase.from("ejemplares").select("*", { count: "exact", head: true }),
    ]);

  const [concursos, asociaciones] = await Promise.all([getConcursos(), getAsociaciones()]);
  const concursosEnCurso = concursos.filter((c) => c.estado === "en_curso");

  return {
    nAsociaciones: nAsociaciones ?? 0,
    nAsociacionesActivas: nAsociacionesActivas ?? 0,
    nConcursosEnCurso: concursosEnCurso.length,
    nEjemplares: nEjemplares ?? 0,
    concursosEnCurso: concursosEnCurso.slice(0, 4),
    asociaciones,
  };
}

export interface AdminAsociacion {
  id: string;
  nombre: string;
  email: string;
  createdAt: string;
}

export async function getAdminsDeAsociacion(asociacionId: string): Promise<AdminAsociacion[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("perfiles")
    .select("id, nombre, email, created_at")
    .eq("asociacion_id", asociacionId)
    .eq("rol", "admin_asociacion")
    .order("created_at");

  return (data ?? []).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    email: p.email,
    createdAt: p.created_at,
  }));
}

export interface UsuarioPlataforma {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  asociacionNombreCorto: string | null;
  createdAt: string;
}

export async function getUsuarios(): Promise<UsuarioPlataforma[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("perfiles")
    .select("id, nombre, email, rol, created_at, asociaciones(nombre_corto)")
    .order("created_at", { ascending: false });

  return (data ?? []).map((p) => {
    const asociacion = p.asociaciones as unknown as { nombre_corto: string } | null;
    return {
      id: p.id,
      nombre: p.nombre,
      email: p.email,
      rol: p.rol,
      asociacionNombreCorto: asociacion?.nombre_corto ?? null,
      createdAt: p.created_at,
    };
  });
}