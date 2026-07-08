import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcurso, getCategoriasConcurso } from "@/lib/admin/data";
import { EstadoBadge } from "@/components/ui/EstadoBadge";

export default async function ResultadosChooserPage({
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

  return (
    <main className="mx-auto max-w-xl px-5 py-6 sm:px-10">
      <h1 className="mb-1 font-display text-[clamp(23px,3.4vw,30px)] text-ink">Ingreso de resultados</h1>
      <p className="mb-5 font-serif text-sm text-muted">Elige la categoría que se está corriendo en pista.</p>

      {categorias.length === 0 ? (
        <p className="font-sans text-sm text-muted">Este concurso todavía no tiene categorías.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/admin/concursos/${id}/categorias/${c.id}/resultados`}
              className="flex items-center gap-3 rounded-[14px] border border-border-soft bg-card p-3.5 transition hover:bg-white"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-serif text-[15.5px] font-semibold text-ink-soft">
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