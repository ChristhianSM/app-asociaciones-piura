import Link from "next/link";
import { getPerfilActual } from "@/lib/admin/data";
import { logoutAdminAsociacion } from "./actions";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const perfil = await getPerfilActual();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-border-soft bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-leather font-display text-[15px] text-cream">
              {perfil?.asociacionNombreCorto?.charAt(0) ?? "A"}
            </div>
            <span className="font-serif text-[14px] font-semibold text-ink-soft">
              {perfil?.asociacionNombreCorto}
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-sans text-xs text-muted sm:inline">{perfil?.email}</span>
            <form action={logoutAdminAsociacion}>
              <button
                type="submit"
                className="h-9 rounded-[9px] border border-border bg-card px-3.5 font-sans text-[12px] font-semibold text-ink-soft"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}