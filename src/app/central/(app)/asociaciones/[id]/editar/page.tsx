import Link from "next/link";
import { notFound } from "next/navigation";
import { getAsociacion } from "@/lib/central/data";
import { EditarAsociacionForm } from "./EditarAsociacionForm";

export default async function EditarAsociacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asociacion = await getAsociacion(id);

  if (!asociacion) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-6 sm:px-10">
      <Link
        href={`/central/asociaciones/${id}`}
        className="font-sans text-[13px] font-semibold text-muted-soft"
      >
        ‹ {asociacion.nombre_corto}
      </Link>
      <h1 className="mb-5 mt-2 font-display text-[clamp(23px,3.4vw,30px)] text-ink">Editar asociación</h1>

      <EditarAsociacionForm
        asociacionId={id}
        nombre={asociacion.nombre}
        nombreCorto={asociacion.nombre_corto}
        region={asociacion.region}
      />
    </main>
  );
}