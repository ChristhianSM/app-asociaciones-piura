"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPerfilActual } from "@/lib/admin/data";
import { slugify } from "@/lib/slug";

export type ConcursoFormState = { error: string } | undefined;

async function generarSlugUnico(nombre: string) {
  const supabase = await createClient();
  const base = slugify(nombre) || "concurso";
  let slug = base;
  let intento = 1;

  while (true) {
    const { data } = await supabase.from("concursos").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    intento += 1;
    slug = `${base}-${intento}`;
  }
}

export async function crearConcurso(
  _prevState: ConcursoFormState,
  formData: FormData
): Promise<ConcursoFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const sede = String(formData.get("sede") ?? "").trim();
  const fechaInicio = String(formData.get("fechaInicio") ?? "").trim();
  const fechaFin = String(formData.get("fechaFin") ?? "").trim();

  if (!nombre || !sede || !fechaInicio || !fechaFin) {
    return { error: "Completa todos los campos." };
  }
  if (fechaFin < fechaInicio) {
    return { error: "La fecha de fin no puede ser anterior a la fecha de inicio." };
  }

  const perfil = await getPerfilActual();
  if (!perfil) {
    return { error: "No se pudo identificar tu asociación." };
  }

  const slug = await generarSlugUnico(nombre);
  const supabase = await createClient();

  const { data: concurso, error } = await supabase
    .from("concursos")
    .insert({
      asociacion_id: perfil.asociacionId,
      slug,
      nombre,
      sede,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    })
    .select("id")
    .single();

  if (error || !concurso) {
    return { error: "No se pudo crear el concurso." };
  }

  redirect(`/admin/concursos/${concurso.id}`);
}