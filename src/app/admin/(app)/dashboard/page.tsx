import Link from "next/link";
import { getMisConcursos } from "@/lib/admin/data";
import { EstadoBadge } from "@/components/ui/EstadoBadge";

function formatFechas(inicio: string, fin: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const inicioStr = new Date(`${inicio}T00:00:00`).toLocaleDateString("es-PE", opts);
  const finStr = new Date(`${fin}T00:00:00`).toLocaleDateString("es-PE", { ...opts, year: "numeric" });
  return `${inicioStr} – ${finStr}`;
}

export default async function MisConcursosPage() {
  const concursos = await getMisConcursos();
  const nEnCurso = concursos.filter((c) => c.estado === "en_curso").length;
  const nPorIniciar = concursos.filter((c) => c.estado === "por_iniciar").length;
  const nFinalizado = concursos.filter((c) => c.estado === "finalizado").length;

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-10">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-leather">
            Tu asociación
          </div>
          <h1 className="mt-1 font-display text-[clamp(24px,3.6vw,32px)] text-ink">Mis concursos</h1>
        </div>
        <Link
          href="/admin/concursos/nuevo"
          className="flex h-[46px] items-center rounded-xl bg-leather px-[18px] font-sans text-[13.5px] font-semibold text-cream"
        >
          ＋ Crear concurso
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-light/40 bg-sky-lighter px-3 py-1 font-sans text-xs text-sky">
          {nEnCurso} en curso
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4D2A1] bg-[#F3E7C8] px-3 py-1 font-sans text-xs text-gold-dark">
          {nPorIniciar} por iniciar
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C7D9B3] bg-field-lighter px-3 py-1 font-sans text-xs text-field">
          {nFinalizado} finalizados
        </span>
      </div>

      {concursos.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Todavía no has creado ningún concurso.{" "}
          <Link href="/admin/concursos/nuevo" className="font-semibold text-leather">
            Crea el primero
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {concursos.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border-soft bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-[17px] font-semibold text-ink-soft">{c.nombre}</span>
                <EstadoBadge estado={c.estado} />
              </div>
              <div className="mt-1 font-sans text-xs text-muted-soft">
                {formatFechas(c.fechaInicio, c.fechaFin)} · {c.sede}
              </div>
              <div className="mt-0.5 font-sans text-xs text-muted-soft">
                {c.nCategorias} categorías · {c.nEjemplares} ejemplares
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/admin/concursos/${c.id}`}
                  className="flex h-[42px] flex-1 items-center justify-center rounded-[11px] bg-ink-soft px-4 font-sans text-[12.5px] font-semibold text-[#F2E9D6]"
                >
                  Abrir y gestionar
                </Link>
                <Link
                  href={`/admin/concursos/${c.id}/editar`}
                  className="flex h-[42px] items-center rounded-[11px] border border-border bg-white px-4 font-sans text-[12.5px] font-semibold text-ink-soft"
                >
                  Editar datos
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}