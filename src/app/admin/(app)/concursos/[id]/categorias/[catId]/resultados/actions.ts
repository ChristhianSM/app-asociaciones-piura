"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function setResultado(
  concursoId: string,
  categoriaId: string,
  ejemplarId: string,
  posicion: number | null
) {
  const supabase = await createClient();

  if (posicion === null) {
    await supabase.from("resultados").delete().eq("categoria_id", categoriaId).eq("ejemplar_id", ejemplarId);
  } else {
    await supabase.from("resultados").delete().eq("categoria_id", categoriaId).eq("posicion", posicion);
    await supabase
      .from("resultados")
      .delete()
      .eq("categoria_id", categoriaId)
      .eq("ejemplar_id", ejemplarId);
    await supabase.from("resultados").insert({ categoria_id: categoriaId, ejemplar_id: ejemplarId, posicion });
  }

  revalidatePath(`/admin/concursos/${concursoId}/categorias/${categoriaId}/resultados`);
}

export async function finalizarCategoria(concursoId: string, categoriaId: string) {
  const supabase = await createClient();
  await supabase.from("categorias").update({ estado: "finalizado" }).eq("id", categoriaId);
  revalidatePath(`/admin/concursos/${concursoId}`);
  redirect(`/admin/concursos/${concursoId}`);
}