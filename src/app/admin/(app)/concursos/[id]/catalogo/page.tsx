import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcurso, getCategoriasConcurso } from "@/lib/admin/data";
import { NuevaCategoriaForm } from "./NuevaCategoriaForm";
import { eliminarCategoria } from "./actions";

export default async function CatalogoPage({
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
  const totalEjemplares = categorias.reduce((sum, c) => sum + c.nEjemplares, 0);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6 sm:px-10">
      <Link href={`/admin/concursos/${id}`} className="font-sans text-[13px] font-semibold text-muted-soft">
        ‹ {concurso.nombre}
      </Link>
      <div className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-leather">
        Pre-evento
      </div>
      <h1 className="mb-4 mt-1 font-display text-[clamp(24px,3.6vw,32px)] text-ink">Cargar catálogo</h1>

      <NuevaCategoriaForm concursoId={id} />

      <div className="mb-2.5 mt-6 flex items-baseline justify-between gap-3">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-soft">
          Catálogo cargado · {categorias.length} categorías
        </span>
        <span className="font-sans text-[11.5px] text-muted-soft">{totalEjemplares} ejemplares</span>
      </div>

      {categorias.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-7 text-center">
          <div className="font-serif text-[14.5px] text-muted">
            Este concurso aún no tiene categorías.
          </div>
          <div className="mt-1 font-sans text-xs text-muted-soft">
            Agrega la primera con el formulario de arriba.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {categorias.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2.5 rounded-[12px] border border-border-soft bg-card p-3"
            >
              <Link
                href={`/admin/concursos/${id}/categorias/${c.id}`}
                className="min-w-0 flex-1"
              >
                <div className="truncate font-serif text-[14.5px] font-semibold text-ink-soft">
                  {c.nombre}
                </div>
                {c.nGrupos > 0 && (
                  <div className="font-sans text-[11px] text-muted-soft">{c.nGrupos} grupos</div>
                )}
              </Link>
              <span className="whitespace-nowrap font-sans text-[11.5px] text-muted-soft">
                {c.nEjemplares} ej.
              </span>
              <Link
                href={`/admin/concursos/${id}/categorias/${c.id}`}
                className="h-8 flex-none rounded-[8px] border border-border bg-white px-3 font-sans text-[11.5px] font-semibold leading-8 text-ink-soft"
              >
                Ejemplares ›
              </Link>
              <form action={eliminarCategoria.bind(null, id, c.id)}>
                <button
                  type="submit"
                  title="Eliminar categoría"
                  className="h-8 w-8 flex-none rounded-[8px] border border-[#EAD6CE] bg-[#F7ECE7] text-[15px] text-leather"
                >
                  ×
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}