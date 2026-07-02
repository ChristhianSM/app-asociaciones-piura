import Link from "next/link";
import { TenantHeader } from "@/components/public/TenantHeader";
import { EstadoBadge } from "@/components/ui/EstadoBadge";
import { getMockConcursoLanding } from "./mock-data";

function formatFechas(inicio: string, fin: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  const inicioStr = new Date(`${inicio}T00:00:00`).toLocaleDateString("es-PE", opts);
  const finStr = new Date(`${fin}T00:00:00`).toLocaleDateString("es-PE", {
    ...opts,
    year: "numeric",
  });
  return `${inicioStr} – ${finStr}`;
}

export default async function ConcursoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { concurso, asociacionNombre, totalPruebas, categorias } = getMockConcursoLanding(slug);
  const destacados = categorias.filter((c) => c.estado === "en_curso").slice(0, 4);

  return (
    <>
      <TenantHeader slug={slug} asociacionNombre={asociacionNombre} />

      <main>
        <div className="mx-auto max-w-3xl px-5 pb-2 pt-8 text-center sm:px-10">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full bg-sky-lighter px-3.5 py-1.5 font-sans text-[11.5px] font-semibold text-sky">
            <span className="h-[7px] w-[7px] flex-none animate-pulse rounded-full bg-sky-mid" />
            <span>
              Concurso en curso · {formatFechas(concurso.fechaInicio, concurso.fechaFin)}
            </span>
          </div>
          <div className="mt-6 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-leather">
            {asociacionNombre}
          </div>
          <h1 className="mt-3 text-balance font-display text-[clamp(30px,6vw,52px)] leading-[1.06] font-normal text-ink">
            {concurso.nombre}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3.5 font-serif text-[15px] italic text-muted">
            <span className="h-px w-8 bg-border" />
            {concurso.sede}
            <span className="h-px w-8 bg-border" />
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-5 py-6 sm:px-10">
          <form
            action={`/c/${slug}/buscar`}
            className="flex items-center gap-2 rounded-2xl border border-border bg-white p-1.5 shadow-[0_10px_26px_-16px_rgba(60,45,25,0.4)]"
          >
            <span className="pl-2.5 text-[19px] text-leather">⌕</span>
            <input
              name="q"
              placeholder="Buscar caballo, criador o propietario…"
              className="min-w-0 flex-1 border-0 bg-transparent px-1.5 py-2 font-serif text-base text-ink-soft outline-none"
            />
            <button
              type="submit"
              className="h-[46px] rounded-[11px] bg-leather px-5 font-sans text-[13px] font-semibold text-cream"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="mx-auto max-w-5xl px-5 pb-14 pt-2 sm:px-10">
          <div className="mb-3.5 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl font-normal text-ink">En competencia ahora</h2>
            <Link
              href={`/c/${slug}/categorias`}
              className="font-sans text-[13px] font-semibold text-leather"
            >
              Ver las {totalPruebas} pruebas ›
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((c) => (
              <Link
                key={c.id}
                href={`/c/${slug}/categorias/${c.id}`}
                className="rounded-2xl border border-border-soft bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(60,45,25,0.5)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-leather">
                    {c.grupo}
                  </span>
                  <EstadoBadge estado={c.estado} />
                </div>
                <div className="mt-2.5 text-pretty font-serif text-[16.5px] font-semibold leading-snug text-ink-soft">
                  {c.nombre}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-2.5 font-sans text-xs text-muted-soft">
                  <span>{c.count} ejemplares</span>
                  <span className="font-semibold text-leather">Ver ›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
