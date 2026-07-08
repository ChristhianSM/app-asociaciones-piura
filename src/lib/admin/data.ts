import "server-only";
import { createClient } from "@/lib/supabase/server";
import { estadoPorFechas } from "@/lib/estado";
import type { EstadoCategoria } from "@/types/domain";

export async function getPerfilActual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, nombre, email, asociacion_id, asociaciones(nombre, nombre_corto)")
    .eq("id", user.id)
    .single();

  if (!perfil) return null;

  const asociacion = perfil.asociaciones as unknown as { nombre: string; nombre_corto: string } | null;

  return {
    id: perfil.id as string,
    nombre: perfil.nombre as string,
    email: perfil.email as string,
    asociacionId: perfil.asociacion_id as string,
    asociacionNombre: asociacion?.nombre ?? "",
    asociacionNombreCorto: asociacion?.nombre_corto ?? "",
  };
}

export interface ConcursoAdmin {
  id: string;
  slug: string;
  nombre: string;
  sede: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCategoria;
  nCategorias: number;
  nEjemplares: number;
}

export async function getMisConcursos(): Promise<ConcursoAdmin[]> {
  const supabase = await createClient();

  const [{ data: concursos }, { data: categorias }] = await Promise.all([
    supabase
      .from("concursos")
      .select("id, slug, nombre, sede, fecha_inicio, fecha_fin")
      .order("fecha_inicio", { ascending: false }),
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
    return {
      id: c.id,
      slug: c.slug,
      nombre: c.nombre,
      sede: c.sede,
      fechaInicio: c.fecha_inicio,
      fechaFin: c.fecha_fin,
      estado: estadoPorFechas(c.fecha_inicio, c.fecha_fin),
      nCategorias: cats.length,
      nEjemplares,
    };
  });
}

export async function getConcurso(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("concursos")
    .select("id, slug, nombre, sede, fecha_inicio, fecha_fin")
    .eq("id", id)
    .single();
  return data;
}

export interface CategoriaAdmin {
  id: string;
  concursoId: string;
  nombre: string;
  orden: number;
  estado: EstadoCategoria;
  tipoAnimal: string | null;
  modalidad: string | null;
  rangoEdad: string | null;
  nGrupos: number;
  nEjemplares: number;
}

export async function getCategoriasConcurso(concursoId: string): Promise<CategoriaAdmin[]> {
  const supabase = await createClient();

  const [{ data: categorias }, { data: grupos }] = await Promise.all([
    supabase
      .from("categorias")
      .select("id, concurso_id, nombre, orden, estado, tipo_animal, modalidad, rango_edad")
      .eq("concurso_id", concursoId)
      .order("orden"),
    supabase.from("grupos").select("id, categoria_id"),
  ]);

  const categoriaIds = (categorias ?? []).map((c) => c.id);
  const { data: ejemplares } = categoriaIds.length
    ? await supabase.from("ejemplares").select("categoria_id").in("categoria_id", categoriaIds)
    : { data: [] as { categoria_id: string }[] };

  const gruposPorCategoria = new Map<string, number>();
  for (const g of grupos ?? []) {
    gruposPorCategoria.set(g.categoria_id, (gruposPorCategoria.get(g.categoria_id) ?? 0) + 1);
  }

  const ejemplaresPorCategoria = new Map<string, number>();
  for (const e of ejemplares ?? []) {
    ejemplaresPorCategoria.set(e.categoria_id, (ejemplaresPorCategoria.get(e.categoria_id) ?? 0) + 1);
  }

  return (categorias ?? []).map((c) => ({
    id: c.id,
    concursoId: c.concurso_id,
    nombre: c.nombre,
    orden: c.orden,
    estado: c.estado,
    tipoAnimal: c.tipo_animal,
    modalidad: c.modalidad,
    rangoEdad: c.rango_edad,
    nGrupos: gruposPorCategoria.get(c.id) ?? 0,
    nEjemplares: ejemplaresPorCategoria.get(c.id) ?? 0,
  }));
}

export async function getCategoria(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categorias")
    .select("id, concurso_id, nombre, orden, estado, tipo_animal, modalidad, rango_edad")
    .eq("id", id)
    .single();
  return data;
}

export interface GrupoAdmin {
  id: string;
  nombre: string;
  orden: number;
}

export async function getGruposCategoria(categoriaId: string): Promise<GrupoAdmin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("grupos")
    .select("id, nombre, orden")
    .eq("categoria_id", categoriaId)
    .order("orden");
  return data ?? [];
}

export interface EjemplarAdmin {
  id: string;
  categoriaId: string;
  grupoId: string | null;
  numeroCancha: number | null;
  prefijo: string;
  nombre: string;
  codigoRegistro: string;
  fechaNacimiento: string | null;
  microchip: string | null;
  padre: string;
  madre: string;
  criador: string;
  propietario: string;
}

export async function getEjemplares(categoriaId: string): Promise<EjemplarAdmin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ejemplares")
    .select(
      "id, categoria_id, grupo_id, numero_cancha, prefijo, nombre, codigo_registro, fecha_nacimiento, microchip, padre, madre, criador, propietario"
    )
    .eq("categoria_id", categoriaId)
    .order("numero_cancha");

  return (data ?? []).map((e) => ({
    id: e.id,
    categoriaId: e.categoria_id,
    grupoId: e.grupo_id,
    numeroCancha: e.numero_cancha,
    prefijo: e.prefijo,
    nombre: e.nombre,
    codigoRegistro: e.codigo_registro,
    fechaNacimiento: e.fecha_nacimiento,
    microchip: e.microchip,
    padre: e.padre,
    madre: e.madre,
    criador: e.criador,
    propietario: e.propietario,
  }));
}

export async function getEjemplar(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ejemplares")
    .select(
      "id, categoria_id, grupo_id, numero_cancha, prefijo, nombre, codigo_registro, fecha_nacimiento, microchip, padre, madre, criador, propietario"
    )
    .eq("id", id)
    .single();
  return data;
}

export interface ResultadoEjemplar extends EjemplarAdmin {
  posicion: number | null;
}

export async function getEjemplaresConResultado(categoriaId: string): Promise<ResultadoEjemplar[]> {
  const supabase = await createClient();
  const [ejemplares, { data: resultados }] = await Promise.all([
    getEjemplares(categoriaId),
    supabase.from("resultados").select("ejemplar_id, posicion").eq("categoria_id", categoriaId),
  ]);

  const posicionPorEjemplar = new Map<string, number>();
  for (const r of resultados ?? []) {
    posicionPorEjemplar.set(r.ejemplar_id, r.posicion);
  }

  return ejemplares.map((e) => ({ ...e, posicion: posicionPorEjemplar.get(e.id) ?? null }));
}