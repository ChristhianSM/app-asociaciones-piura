"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function toggleActivoAsociacion(asociacionId: string, activo: boolean) {
  const supabase = await createClient();
  await supabase.from("asociaciones").update({ activo }).eq("id", asociacionId);
  revalidatePath(`/central/asociaciones/${asociacionId}`);
  revalidatePath("/central/asociaciones");
  revalidatePath("/central/dashboard");
}

export type InvitarAdminState = { error: string } | undefined;

export async function invitarAdmin(
  asociacionId: string,
  _prevState: InvitarAdminState,
  formData: FormData
): Promise<InvitarAdminState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nombre || !email || !password) {
    return { error: "Completa todos los campos." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (userError || !userData.user) {
    const mensaje =
      userError?.code === "email_exists" ? "Ese correo ya está registrado." : "No se pudo crear el usuario.";
    return { error: mensaje };
  }

  const { error: perfilError } = await supabase.from("perfiles").insert({
    id: userData.user.id,
    rol: "admin_asociacion",
    asociacion_id: asociacionId,
    nombre,
    email,
  });

  if (perfilError) {
    await admin.auth.admin.deleteUser(userData.user.id);
    return { error: "No se pudo vincular el perfil del administrador." };
  }

  revalidatePath(`/central/asociaciones/${asociacionId}`);
}

export type EditarAsociacionState = { error: string } | undefined;

export async function actualizarAsociacion(
  asociacionId: string,
  _prevState: EditarAsociacionState,
  formData: FormData
): Promise<EditarAsociacionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const nombreCorto = String(formData.get("nombreCorto") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();

  if (!nombre || !nombreCorto) {
    return { error: "El nombre y la sigla son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("asociaciones")
    .update({ nombre, nombre_corto: nombreCorto, region: region || null })
    .eq("id", asociacionId);

  if (error) {
    return { error: "No se pudo guardar los cambios." };
  }

  revalidatePath(`/central/asociaciones/${asociacionId}`);
  redirect(`/central/asociaciones/${asociacionId}`);
}