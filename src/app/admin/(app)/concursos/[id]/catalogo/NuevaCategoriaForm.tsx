"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { crearCategoria } from "./actions";

const selectClass =
  "h-[46px] w-full rounded-[11px] border border-border bg-white px-3 font-serif text-sm text-ink-soft outline-none focus:border-leather";
const labelClass = "font-sans text-[11px] text-muted-soft";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-3.5 h-[46px] rounded-[11px] border border-ink-soft bg-ink-soft px-5 font-sans text-[13px] font-semibold text-[#F2E9D6] disabled:opacity-60"
    >
      {pending ? "Agregando…" : "＋ Agregar categoría"}
    </button>
  );
}

export function NuevaCategoriaForm({ concursoId }: { concursoId: string }) {
  const action = crearCategoria.bind(null, concursoId);
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="rounded-2xl border border-border-soft bg-card p-4.5">
      <div className="mb-3 font-sans text-[13px] font-semibold text-ink-soft">Nueva categoría</div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Tipo de animal</span>
          <select name="tipoAnimal" defaultValue="Capones" className={selectClass}>
            <option>Capones</option>
            <option>Potrancas</option>
            <option>Potrillos</option>
            <option>Potros</option>
            <option>Yeguas</option>
            <option>Pruebas iniciales</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Modalidad</span>
          <select name="modalidad" defaultValue="Freno y Espuelas" className={selectClass}>
            <option>Freno y Espuelas</option>
            <option>Bozal</option>
            <option>Al Cabestro</option>
            <option>Enfrenadura</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Rango de edad</span>
          <select name="rangoEdad" defaultValue="4 a 10 años" className={selectClass}>
            <option>3 a 4 años</option>
            <option>4 a 10 años</option>
            <option>10 a 12 años</option>
            <option>12 a 14 años</option>
            <option>14 años a más</option>
            <option>1 a 3 años</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>N.º de grupos</span>
          <select name="nGrupos" defaultValue="0" className={selectClass}>
            <option value="0">Sin grupos</option>
            <option value="2">2 grupos</option>
            <option value="3">3 grupos</option>
            <option value="4">4 grupos</option>
          </select>
        </label>
      </div>

      {state?.error && (
        <div className="mt-3 rounded-[11px] border border-[#E4C4B8] bg-[#F3DCD3] px-3 py-2.5 font-sans text-[12.5px] text-[#8A3B24]">
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}