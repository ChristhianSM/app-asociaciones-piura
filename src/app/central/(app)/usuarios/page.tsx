import { getUsuarios } from "@/lib/central/data";

const ROL_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin_asociacion: "Admin de asociación",
};

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-10">
      <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
        Cuentas de la plataforma
      </div>
      <h1 className="mt-1 font-display text-[clamp(24px,3.6vw,32px)] text-ink">Usuarios</h1>

      <div className="mt-5 flex flex-col gap-2">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center gap-3 rounded-[13px] border border-border-soft bg-card p-3"
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-border-soft font-display text-base text-muted">
              {u.nombre.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-[15px] font-semibold text-ink-soft">{u.nombre}</div>
              <div className="truncate font-sans text-[11.5px] text-muted-soft">{u.email}</div>
            </div>
            {u.asociacionNombreCorto && (
              <span className="max-w-[140px] truncate font-sans text-[11.5px] text-muted-soft">
                {u.asociacionNombreCorto}
              </span>
            )}
            <span
              className={
                "whitespace-nowrap rounded-full px-2.5 py-1 font-sans text-[10.5px] font-semibold " +
                (u.rol === "super_admin" ? "bg-[#F3E7C8] text-gold-dark" : "bg-sky-lighter text-sky")
              }
            >
              {ROL_LABEL[u.rol] ?? u.rol}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}