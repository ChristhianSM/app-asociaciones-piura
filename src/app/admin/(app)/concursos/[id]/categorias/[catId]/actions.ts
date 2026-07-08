"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EjemplarFormState = { error: string } | undefined;

interface CamposEjemplar {
  numero_cancha: number | null;
  prefijo: string;
  nombre: string;
  codigo_registro: string;
  fecha_nacimiento: string | null;
  microchip: string | null;
  padre: string;
  madre: string;
  criador: string;
  propietario: string;
  grupo_id: string | null;
}

function leerCamposEjemplar(
  formData: FormData
): { ok: true; campos: CamposEjemplar } | { ok: false; error: string } {
  const numeroCancha = String(formData.get("numeroCancha") ?? "").trim();
  const prefijo = String(formData.get("prefijo") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const codigoRegistro = String(formData.get("codigoRegistro") ?? "").trim();
  const fechaNacimiento = String(formData.get("fechaNacimiento") ?? "").trim();
  const microchip = String(formData.get("microchip") ?? "").trim();
  const padre = String(formData.get("padre") ?? "").trim();
  const madre = String(formData.get("madre") ?? "").trim();
  const criador = String(formData.get("criador") ?? "").trim();
  const propietario = String(formData.get("propietario") ?? "").trim();
  const grupoId = String(formData.get("grupoId") ?? "").trim();

  if (!nombre || !codigoRegistro || !padre || !madre || !criador || !propietario) {
    return { ok: false, error: "Completa los campos obligatorios (*)." };
  }

  return {
    ok: true,
    campos: {
      numero_cancha: numeroCancha ? Number(numeroCancha) : null,
      prefijo,
      nombre,
      codigo_registro: codigoRegistro,
      fecha_nacimiento: fechaNacimiento || null,
      microchip: microchip || null,
      padre,
      madre,
      criador,
      propietario,
      grupo_id: grupoId || null,
    },
  };
}

export async function crearEjemplar(
  concursoId: string,
  categoriaId: string,
  _prevState: EjemplarFormState,
  formData: FormData
): Promise<EjemplarFormState> {
  const resultado = leerCamposEjemplar(formData);
  if (!resultado.ok) return { error: resultado.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("ejemplares")
    .insert({ categoria_id: categoriaId, ...resultado.campos });

  if (error) {
    return { error: "No se pudo guardar el ejemplar." };
  }

  revalidatePath(`/admin/concursos/${concursoId}/categorias/${categoriaId}`);
  revalidatePath(`/admin/concursos/${concursoId}/catalogo`);
}

export async function actualizarEjemplar(
  concursoId: string,
  categoriaId: string,
  ejemplarId: string,
  _prevState: EjemplarFormState,
  formData: FormData
): Promise<EjemplarFormState> {
  const resultado = leerCamposEjemplar(formData);
  if (!resultado.ok) return { error: resultado.error };

  const supabase = await createClient();
  const { error } = await supabase.from("ejemplares").update(resultado.campos).eq("id", ejemplarId);

  if (error) {
    return { error: "No se pudo guardar los cambios." };
  }

  revalidatePath(`/admin/concursos/${concursoId}/categorias/${categoriaId}`);
  redirect(`/admin/concursos/${concursoId}/categorias/${categoriaId}`);
}

export async function eliminarEjemplar(concursoId: string, categoriaId: string, ejemplarId: string) {
  const supabase = await createClient();
  await supabase.from("ejemplares").delete().eq("id", ejemplarId);
  revalidatePath(`/admin/concursos/${concursoId}/categorias/${categoriaId}`);
  revalidatePath(`/admin/concursos/${concursoId}/catalogo`);
}