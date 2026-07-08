import { notFound } from "next/navigation";
import { getCategoria, getEjemplaresConResultado } from "@/lib/admin/data";
import { EstadoBadge } from "@/components/ui/EstadoBadge";
import { setResultado, finalizarCategoria } from "./actions";

const POSICIONES = [1, 2, 3, 4, 5] as const;

export default async function ResultadosPage({
  params,
}: {
  params: Promise<{ id: string; catId: string }>;
}) {
  const { id, catId } = await params;
  const categoria = await getCategoria(catId);

  if (!categoria || categoria.concurso_id !== id) {
    notFound();
  }

  const ejemplares = await getEjemplaresConResultado(catId);

  return (
    <main className="mx-auto max-w-2xl px-5 py-6 pb-28 sm:px-10">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-2.5">
        <h1 className="font-display text-[clamp(20px,3vw,27px)] leading-tight text-ink">
          {categoria.nombre}
        </h1>
        <EstadoBadge estado={categoria.estado} />
      </div>
      <p className="mb-5 font-sans text-[11.5px] text-muted-soft">
        Toca la posición de cada ejemplar. Se guarda automáticamente.
      </p>

      {ejemplares.length === 0 ? (
        <p className="font-sans text-sm text-muted">Esta categoría todavía no tiene ejemplares.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {ejemplares.map((e, i) => (
            <div key={e.id} className="rounded-2xl border border-border-soft bg-card p-3">
              <div className="mb-2.5 flex items-center gap-2.5">
                <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] border border-border-soft bg-[#F1E9D7] font-sans text-[13px] font-bold text-muted">
                  {e.numeroCancha ?? i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-base font-semibold text-ink-soft">
                    {e.prefijo} {e.nombre}
                  </div>
                  {e.numeroCancha && (
                    <div className="font-sans text-[11px] text-muted-soft">Cancha {e.numeroCancha}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POSICIONES.map((p) => (
                  <form key={p} action={setResultado.bind(null, id, catId, e.id, p)}>
                    <button
                      type="submit"
                      className={
                        "h-10 min-w-[46px] rounded-[10px] px-2.5 font-sans text-[12.5px] font-bold " +
                        (e.posicion === p
                          ? "bg-leather text-cream"
                          : "border border-border bg-white text-ink-soft")
                      }
                    >
                      {p}.º
                    </button>
                  </form>
                ))}
                <form action={setResultado.bind(null, id, catId, e.id, null)}>
                  <button
                    type="submit"
                    className={
                      "h-10 min-w-[46px] rounded-[10px] px-2.5 font-sans text-[12.5px] font-bold " +
                      (e.posicion === null
                        ? "bg-ink-soft text-cream"
                        : "border border-border bg-white text-muted")
                    }
                  >
                    —
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-cream via-cream/95 to-transparent px-5 pb-5 pt-8 sm:px-10">
        <div className="mx-auto flex max-w-2xl gap-2.5">
          <form action={finalizarCategoria.bind(null, id, catId)} className="flex-1">
            <button
              type="submit"
              className="h-[54px] w-full rounded-2xl border border-[#C7D9B3] bg-field-lighter font-sans text-sm font-bold text-field"
            >
              ✓ Finalizar categoría
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}