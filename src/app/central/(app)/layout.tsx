import { createClient } from "@/lib/supabase/server";
import { NavLinks } from "@/components/central/NavLinks";
import { logoutSuperAdmin } from "./actions";

export default async function CentralAppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-border-soft bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] border border-[#5a5040] bg-gradient-to-br from-hide to-[#4a4234] font-display text-[15px] text-gold-lighter">
            C
          </div>
          <NavLinks />
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-sans text-xs text-muted sm:inline">{user?.email}</span>
            <form action={logoutSuperAdmin}>
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