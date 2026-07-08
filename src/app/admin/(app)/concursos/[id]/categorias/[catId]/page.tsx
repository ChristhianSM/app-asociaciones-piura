import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoria, getGruposCategoria, getEjemplares } from "@/lib/admin/data";
import { EjemplarForm } from "./EjemplarForm";
import { crearEjemplar, eliminarEjemplar } from "./actions";

export default async function CategoriaEjemplaresPage({
  params,
}: {
  params: Promise<{ id: string; catId: string }>;
}) {
  const { id, catId } = await params;
  const categoria = await getCategoria(catId);

  if (!categoria || categoria.concurso_id !== id) {
    notFound();
  }

  const [grupos, ejemplares] = await Promise.all([getGruposCategoria(catId), getEjemplares(catId)]);
  const gruposPorId = new Map(grupos.map((g) => [g.id, g.nombre]));

  const crear = crearEjemplar.bind(null, id, catId);

  return (
    <main className="mx-auto max-w-4xl px-5 py-6 sm:px-10">
      <Link href={`/admin/concursos/${id}/catalogo`} className="font-sans text-[13px] font-semibold text-muted-soft">
        ‹ Catálogo
      </Link>
      <h1 className="mb-1 mt-2 font-display text-[clamp(21px,3.2vw,29px)] leading-tight text-ink">
        {categoria.nombre}
      </h1>
      <div className="mb-5 font-serif text-sm text-muted">{ejemplares.length} ejemplares registrados</div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
        <EjemplarForm action={crear} grupos={grupos} submitLabel="＋ Agregar ejemplar" title="Nuevo ejemplar" />

        <div>
          <div className="mb-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-soft">
            Padrón · {ejemplares.length}
          </div>
          {ejemplares.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center">
              <div className="font-serif text-[14.5px] text-muted">
                Aún no hay ejemplares en esta categoría.
              </div>
              <div className="mt-1 font-sans text-xs text-muted-soft">
                Complétalos con el formulario de la izquierda.
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {ejemplares.map((e, i) => (
                <div
                  key={e.id}
                  className="flex items-center gap-2.5 rounded-[12px] border border-border-soft bg-card p-2.5"
                >
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] border border-border-soft bg-[#F1E9D7] font-sans text-xs font-bold text-muted">
                    {e.numeroCancha ?? i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-serif text-[14.5px] font-semibold text-ink-soft">
                      <span className="font-sans text-[10.5px] font-bold tracking-wide text-leather">
                        {e.prefijo}
                      </span>{" "}
                      {e.nombre}
                    </div>
                    <div className="truncate font-sans text-[10.5px] text-muted-soft">
                      {e.propietario}
                      {e.grupoId && gruposPorId.has(e.grupoId) ? ` · ${gruposPorId.get(e.grupoId)}` : ""}
                    </div>
                  </div>
                  <Link
                    href={`/admin/concursos/${id}/categorias/${catId}/ejemplares/${e.id}/editar`}
                    title="Editar"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] border border-border bg-white text-muted-soft"
                  >
                    ✎
                  </Link>
                  <form action={eliminarEjemplar.bind(null, id, catId, e.id)}>
                    <button
                      type="submit"
                      title="Eliminar"
                      className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] border border-[#EAD6CE] bg-[#F7ECE7] text-leather"
                    >
                      ×
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}