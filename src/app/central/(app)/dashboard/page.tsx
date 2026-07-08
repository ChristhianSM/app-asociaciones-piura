import Link from "next/link";
import { getResumenGlobal } from "@/lib/central/data";
import { EstadoBadge } from "@/components/ui/EstadoBadge";
import { AsociacionRow } from "@/components/central/AsociacionRow";

export default async function CentralDashboardPage() {
  const { nAsociaciones, nAsociacionesActivas, nConcursosEnCurso, nEjemplares, concursosEnCurso, asociaciones } =
    await getResumenGlobal();

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-10">
      <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
        Vista de plataforma
      </div>
      <h1 className="mt-1 font-display text-[clamp(24px,3.6vw,34px)] text-ink">Resumen global</h1>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-[15px] border border-border-soft bg-card p-4">
          <div className="font-display text-[34px] text-ink-soft">{nAsociaciones}</div>
          <div className="font-sans text-xs text-muted-soft">
            asociaciones · {nAsociacionesActivas} activas
          </div>
        </div>
        <div className="rounded-[15px] border border-sky-light/40 bg-sky-lighter p-4">
          <div className="font-display text-[34px] text-sky">{nConcursosEnCurso}</div>
          <div className="font-sans text-xs text-sky">concursos en curso</div>
        </div>
        <div className="rounded-[15px] border border-border-soft bg-card p-4">
          <div className="font-display text-[34px] text-ink-soft">{nEjemplares}</div>
          <div className="font-sans text-xs text-muted-soft">ejemplares registrados</div>
        </div>
      </div>

      <div className="mb-3 mt-7 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-[#5C5347]">Concursos en curso ahora</h2>
        <Link href="/central/asociaciones" className="font-sans text-[13px] font-semibold text-leather">
          Todas las asociaciones ›
        </Link>
      </div>

      {concursosEnCurso.length === 0 ? (
        <p className="font-sans text-sm text-muted">No hay concursos en curso en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {concursosEnCurso.map((c) => (
            <Link
              key={c.id}
              href={`/central/asociaciones/${c.asociacionId}`}
              className="rounded-2xl border border-border-soft bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(60,45,25,0.5)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-leather">
                  {c.asociacionNombreCorto}
                </span>
                <EstadoBadge estado={c.estado} />
              </div>
              <div className="mt-2.5 font-serif text-[16px] font-semibold leading-snug text-ink-soft">
                {c.nombre}
              </div>
              <div className="mt-3 flex items-center gap-4 border-t border-border-soft pt-2.5 font-sans text-xs text-muted-soft">
                <span>{c.nCategorias} categorías</span>
                <span>{c.nEjemplares} ejemplares</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mb-3 mt-7 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-[#5C5347]">Asociaciones</h2>
      </div>

      {asociaciones.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Todavía no hay asociaciones registradas.{" "}
          <Link href="/central/asociaciones/nueva" className="font-semibold text-leather">
            Crea la primera
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {asociaciones.map((a) => (
            <AsociacionRow key={a.id} asociacion={a} />
          ))}
        </div>
      )}
    </main>
  );
}