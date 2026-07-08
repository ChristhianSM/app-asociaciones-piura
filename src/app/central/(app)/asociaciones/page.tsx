import Link from "next/link";
import { getAsociaciones } from "@/lib/central/data";

export default async function AsociacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const asociaciones = await getAsociaciones(q);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Directorio
          </div>
          <h1 className="mt-1 font-display text-[clamp(24px,3.6vw,32px)] text-ink">Asociaciones</h1>
        </div>
        <Link
          href="/central/asociaciones/nueva"
          className="flex h-[46px] items-center rounded-xl bg-gradient-to-br from-[#3a3226] to-hide-dark px-[18px] font-sans text-[13.5px] font-semibold text-[#F2E9D6]"
        >
          ＋ Nueva asociación
        </Link>
      </div>

      <form
        method="get"
        className="mb-4.5 flex items-center gap-1.5 rounded-[13px] border border-border bg-white p-1.5"
      >
        <span className="pl-2.5 text-[17px] text-leather">⌕</span>
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre o región…"
          className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 font-serif text-[15px] text-ink-soft outline-none"
        />
      </form>

      {asociaciones.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          {q ? "No se encontraron asociaciones para esa búsqueda." : "Todavía no hay asociaciones registradas."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {asociaciones.map((a) => (
            <Link
              key={a.id}
              href={`/central/asociaciones/${a.id}`}
              className="flex flex-col rounded-2xl border border-border-soft bg-card p-[17px] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(60,45,25,0.5)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[11px] bg-gradient-to-br from-hide to-[#4a4234] font-display text-lg text-gold-lighter">
                  {a.nombreCorto.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-[15.5px] font-semibold text-ink-soft">
                    {a.nombreCorto}
                  </div>
                  <div className="mt-0.5 font-sans text-[11.5px] text-muted-soft">
                    {a.region ?? "Sin región"}
                  </div>
                </div>
                <span
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[10.5px] font-semibold " +
                    (a.activo ? "bg-field-lighter text-field" : "bg-[#F3DCD3] text-leather-dark")
                  }
                >
                  <span className={"h-1.5 w-1.5 rounded-full " + (a.activo ? "bg-field-light" : "bg-leather")} />
                  {a.activo ? "Activa" : "Suspendida"}
                </span>
              </div>
              <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-border-soft pt-3">
                <div>
                  <div className="font-display text-xl text-ink-soft">{a.nConcursos}</div>
                  <div className="font-sans text-[10.5px] text-muted-soft">concursos</div>
                </div>
                <div>
                  <div className="font-display text-xl text-ink-soft">{a.nAdmins}</div>
                  <div className="font-sans text-[10.5px] text-muted-soft">admins</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}