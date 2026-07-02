import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/central/login", request.url));
  }

  // Sin proyecto Supabase todavía (ver .env.local.example): deja pasar todo
  // sin gating de sesión hasta que se completen las credenciales reales.
  if (!supabaseConfigured) {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isCentralRoute = pathname.startsWith("/central") && pathname !== "/central/login";

  // TODO: cuando exista la tabla `perfiles` en Supabase, además de verificar
  // que hay sesión hay que verificar que perfil.rol coincide con la sección
  // (admin_asociacion vs super_admin) antes de dejar pasar la request.
  if ((isAdminRoute || isCentralRoute) && !user) {
    const loginPath = isAdminRoute ? "/admin/login" : "/central/login";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
