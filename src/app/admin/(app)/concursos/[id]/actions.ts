"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ConcursoFormState = { error: string } | undefined;

export async function actualizarConcurso(
  concursoId: string,
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

  const supabase = await createClient();
  const { error } = await supabase
    .from("concursos")
    .update({ nombre, sede, fecha_inicio: fechaInicio, fecha_fin: fechaFin })
    .eq("id", concursoId);

  if (error) {
    return { error: "No se pudo guardar los cambios." };
  }

  revalidatePath(`/admin/concursos/${concursoId}`);
  revalidatePath("/admin/dashboard");
  redirect(`/admin/concursos/${concursoId}`);
}