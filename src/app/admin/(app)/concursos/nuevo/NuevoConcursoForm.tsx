"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { crearConcurso } from "./actions";

const labelClass = "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-soft";
const inputClass =
  "mt-1 h-11 w-full rounded-[11px] border border-border bg-white px-3.5 font-serif text-sm text-ink-soft outline-none focus:border-leather";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[50px] rounded-xl bg-leather font-sans text-sm font-bold text-cream disabled:opacity-60"
    >
      {pending ? "Creando…" : "Crear concurso"}
    </button>
  );
}

export function NuevoConcursoForm() {
  const [state, formAction] = useActionState(crearConcurso, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3.5 rounded-2xl border border-border-soft bg-card p-4.5"
    >
      <label className="flex flex-col">
        <span className={labelClass}>Nombre del concurso *</span>
        <input
          name="nombre"
          required
          placeholder="LXXX Concurso Nacional Oficial"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col">
        <span className={labelClass}>Sede *</span>
        <input name="sede" required placeholder="Coliseo Las Capullanas · Piura" className={inputClass} />
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col">
          <span className={labelClass}>Fecha de inicio *</span>
          <input name="fechaInicio" type="date" required className={inputClass} />
        </label>
        <label className="flex flex-col">
          <span className={labelClass}>Fecha de fin *</span>
          <input name="fechaFin" type="date" required className={inputClass} />
        </label>
      </div>

      {state?.error && (
        <div className="rounded-[11px] border border-[#E4C4B8] bg-[#F3DCD3] px-3 py-2.5 font-sans text-[12.5px] text-[#8A3B24]">
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}