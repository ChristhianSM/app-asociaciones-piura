"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CategoriaFormState = { error: string } | undefined;

export async function crearCategoria(
  concursoId: string,
  _prevState: CategoriaFormState,
  formData: FormData
): Promise<CategoriaFormState> {
  const tipoAnimal = String(formData.get("tipoAnimal") ?? "").trim();
  const modalidad = String(formData.get("modalidad") ?? "").trim();
  const rangoEdad = String(formData.get("rangoEdad") ?? "").trim();
  const nGrupos = Number(formData.get("nGrupos") ?? 0);

  if (!tipoAnimal || !modalidad || !rangoEdad) {
    return { error: "Completa los tres campos de la categoría." };
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("categorias")
    .select("*", { count: "exact", head: true })
    .eq("concurso_id", concursoId);

  const nombre = `${tipoAnimal} · ${modalidad} · ${rangoEdad}`;

  const { data: categoria, error } = await supabase
    .from("categorias")
    .insert({
      concurso_id: concursoId,
      nombre,
      orden: count ?? 0,
      tipo_animal: tipoAnimal,
      modalidad,
      rango_edad: rangoEdad,
    })
    .select("id")
    .single();

  if (error || !categoria) {
    return { error: "No se pudo crear la categoría." };
  }

  if (nGrupos > 0) {
    const grupos = Array.from({ length: nGrupos }, (_, i) => ({
      categoria_id: categoria.id,
      nombre: `Grupo ${i + 1}`,
      orden: i,
    }));
    await supabase.from("grupos").insert(grupos);
  }

  revalidatePath(`/admin/concursos/${concursoId}/catalogo`);
  revalidatePath(`/admin/concursos/${concursoId}`);
}

export async function eliminarCategoria(concursoId: string, categoriaId: string) {
  const supabase = await createClient();
  await supabase.from("categorias").delete().eq("id", categoriaId);
  revalidatePath(`/admin/concursos/${concursoId}/catalogo`);
  revalidatePath(`/admin/concursos/${concursoId}`);
}