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

  const { supabaseResponse, user, rol } = await updateSession(request);

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isCentralRoute = pathname.startsWith("/central") && pathname !== "/central/login";

  if (isCentralRoute && (!user || rol !== "super_admin")) {
    return NextResponse.redirect(new URL("/central/login", request.url));
  }

  if (isAdminRoute && (!user || rol !== "admin_asociacion")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
