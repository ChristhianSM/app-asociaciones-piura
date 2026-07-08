import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcurso, getCategoriasConcurso } from "@/lib/admin/data";
import { EstadoBadge } from "@/components/ui/EstadoBadge";

function formatFechas(inicio: string, fin: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const inicioStr = new Date(`${inicio}T00:00:00`).toLocaleDateString("es-PE", opts);
  const finStr = new Date(`${fin}T00:00:00`).toLocaleDateString("es-PE", opts);
  return `${inicioStr} – ${finStr}`;
}

export default async function ConcursoDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concurso = await getConcurso(id);

  if (!concurso) {
    notFound();
  }

  const categorias = await getCategoriasConcurso(id);
  const nFin = categorias.filter((c) => c.estado === "finalizado").length;
  const nCur = categorias.filter((c) => c.estado === "en_curso").length;
  const nIni = categorias.filter((c) => c.estado === "por_iniciar").length;
  const pct = categorias.length === 0 ? 0 : Math.round((nFin / categorias.length) * 100);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6 sm:px-10">
      <Link href="/admin/dashboard" className="font-sans text-[13px] font-semibold text-muted-soft">
        ‹ Mis concursos
      </Link>
      <div className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-leather">
        {formatFechas(concurso.fecha_inicio, concurso.fecha_fin)}
      </div>
      <h1 className="mb-4 mt-1 font-display text-[clamp(24px,3.6vw,34px)] leading-tight text-ink">
        {concurso.nombre}
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-[15px] border border-border-soft bg-card p-4">
          <div className="font-display text-[28px] text-ink-soft">{categorias.length}</div>
          <div className="font-sans text-xs text-muted-soft">categorías</div>
        </div>
        <div className="rounded-[15px] border border-[#C7D9B3] bg-field-lighter p-4">
          <div className="font-display text-[28px] text-field">{nFin}</div>
          <div className="font-sans text-xs text-field">finalizadas</div>
        </div>
        <div className="rounded-[15px] border border-sky-light/40 bg-sky-lighter p-4">
          <div className="font-display text-[28px] text-sky">{nCur}</div>
          <div className="font-sans text-xs text-sky">en curso</div>
        </div>
        <div className="rounded-[15px] border border-[#E4D2A1] bg-[#F3E7C8] p-4">
          <div className="font-display text-[28px] text-gold-dark">{nIni}</div>
          <div className="font-sans text-xs text-gold-dark">por iniciar</div>
        </div>
      </div>

      <div className="mt-3.5 rounded-[15px] border border-border-soft bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-sans text-[12.5px] font-semibold text-[#5C5347]">
            Avance del concurso
          </span>
          <span className="font-display text-lg text-leather">{pct}%</span>
        </div>
        <div className="h-[11px] overflow-hidden rounded-full bg-border-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-field-light to-field"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <Link
          href={`/admin/concursos/${id}/resultados`}
          className="flex items-center gap-2.5 rounded-2xl bg-ink-soft p-4 text-[#F2E9D6]"
        >
          <span className="text-xl">🏇</span>
          <span className="font-sans text-[13.5px] font-semibold leading-tight">
            Ingresar
            <br />
            resultados
          </span>
        </Link>
        <Link
          href={`/admin/concursos/${id}/catalogo`}
          className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-ink-soft"
        >
          <span className="text-xl">📋</span>
          <span className="font-sans text-[13.5px] font-semibold leading-tight">
            Cargar
            <br />
            catálogo
          </span>
        </Link>
        <Link
          href={`/admin/concursos/${id}/qr`}
          className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-ink-soft"
        >
          <span className="text-xl">▦</span>
          <span className="font-sans text-[13.5px] font-semibold leading-tight">
            Generar
            <br />
            código QR
          </span>
        </Link>
      </div>

      <div className="mb-2.5 mt-6 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl text-[#5C5347]">Categorías</h2>
        <span className="font-sans text-[11.5px] text-muted-soft">Toca para ingresar resultados</span>
      </div>

      {categorias.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Este concurso todavía no tiene categorías.{" "}
          <Link href={`/admin/concursos/${id}/catalogo`} className="font-semibold text-leather">
            Carga el catálogo
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/admin/concursos/${id}/categorias/${c.id}/resultados`}
              className="flex items-center gap-3 rounded-[13px] border border-border-soft bg-card p-3 transition hover:bg-white"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-serif text-[15px] font-semibold text-ink-soft">
                  {c.nombre}
                </div>
                <div className="font-sans text-[11px] text-muted-soft">{c.nEjemplares} ejemplares</div>
              </div>
              <EstadoBadge estado={c.estado} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}