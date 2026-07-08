import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcurso } from "@/lib/admin/data";
import { EditarConcursoForm } from "./EditarConcursoForm";

export default async function EditarConcursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concurso = await getConcurso(id);

  if (!concurso) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-6 sm:px-10">
      <Link href={`/admin/concursos/${id}`} className="font-sans text-[13px] font-semibold text-muted-soft">
        ‹ {concurso.nombre}
      </Link>
      <h1 className="mb-5 mt-2 font-display text-[clamp(23px,3.4vw,30px)] text-ink">Editar concurso</h1>

      <EditarConcursoForm
        concursoId={id}
        nombre={concurso.nombre}
        sede={concurso.sede}
        fechaInicio={concurso.fecha_inicio}
        fechaFin={concurso.fecha_fin}
      />
    </main>
  );
}