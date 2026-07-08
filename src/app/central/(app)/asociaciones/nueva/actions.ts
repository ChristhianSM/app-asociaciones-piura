"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AsociacionFormState = { error: string } | undefined;

export async function crearAsociacion(
  _prevState: AsociacionFormState,
  formData: FormData
): Promise<AsociacionFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const nombreCorto = String(formData.get("nombreCorto") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const adminNombre = String(formData.get("adminNombre") ?? "").trim();
  const adminEmail = String(formData.get("adminEmail") ?? "").trim();
  const adminPassword = String(formData.get("adminPassword") ?? "");

  if (!nombre || !nombreCorto || !adminNombre || !adminEmail || !adminPassword) {
    return { error: "Completa todos los campos obligatorios (*)." };
  }
  if (adminPassword.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: asociacion, error: asocError } = await supabase
    .from("asociaciones")
    .insert({ nombre, nombre_corto: nombreCorto, region: region || null })
    .select("id")
    .single();

  if (asocError || !asociacion) {
    return { error: "No se pudo crear la asociación." };
  }

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (userError || !userData.user) {
    await supabase.from("asociaciones").delete().eq("id", asociacion.id);
    const mensaje =
      userError?.code === "email_exists"
        ? "Ese correo ya está registrado."
        : "No se pudo crear el usuario administrador.";
    return { error: mensaje };
  }

  const { error: perfilError } = await supabase.from("perfiles").insert({
    id: userData.user.id,
    rol: "admin_asociacion",
    asociacion_id: asociacion.id,
    nombre: adminNombre,
    email: adminEmail,
  });

  if (perfilError) {
    await admin.auth.admin.deleteUser(userData.user.id);
    await supabase.from("asociaciones").delete().eq("id", asociacion.id);
    return { error: "No se pudo vincular el perfil del administrador." };
  }

  redirect(`/central/asociaciones/${asociacion.id}`);
}