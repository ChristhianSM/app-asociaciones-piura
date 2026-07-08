import { notFound } from "next/navigation";
import { getEjemplar, getGruposCategoria } from "@/lib/admin/data";
import { EjemplarForm } from "../../../EjemplarForm";
import { actualizarEjemplar } from "../../../actions";

export default async function EditarEjemplarPage({
  params,
}: {
  params: Promise<{ id: string; catId: string; ejemplarId: string }>;
}) {
  const { id, catId, ejemplarId } = await params;
  const ejemplar = await getEjemplar(ejemplarId);

  if (!ejemplar || ejemplar.categoria_id !== catId) {
    notFound();
  }

  const grupos = await getGruposCategoria(catId);
  const actualizar = actualizarEjemplar.bind(null, id, catId, ejemplarId);

  return (
    <main className="mx-auto max-w-lg px-5 py-6 sm:px-10">
      <EjemplarForm
        action={actualizar}
        grupos={grupos}
        defaultValues={{
          id: ejemplar.id,
          categoriaId: ejemplar.categoria_id,
          grupoId: ejemplar.grupo_id,
          numeroCancha: ejemplar.numero_cancha,
          prefijo: ejemplar.prefijo,
          nombre: ejemplar.nombre,
          codigoRegistro: ejemplar.codigo_registro,
          fechaNacimiento: ejemplar.fecha_nacimiento,
          microchip: ejemplar.microchip,
          padre: ejemplar.padre,
          madre: ejemplar.madre,
          criador: ejemplar.criador,
          propietario: ejemplar.propietario,
        }}
        submitLabel="Guardar cambios"
        cancelHref={`/admin/concursos/${id}/categorias/${catId}`}
        title="Editar ejemplar"
      />
    </main>
  );
}