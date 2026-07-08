"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { actualizarAsociacion } from "../actions";

const labelClass = "font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-soft";
const inputClass =
  "mt-1 h-11 w-full rounded-[11px] border border-border bg-white px-3.5 font-serif text-sm text-ink-soft outline-none focus:border-leather";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[50px] rounded-xl bg-gradient-to-br from-[#3a3226] to-hide-dark font-sans text-sm font-bold text-[#F2E9D6] disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export function EditarAsociacionForm({
  asociacionId,
  nombre,
  nombreCorto,
  region,
}: {
  asociacionId: string;
  nombre: string;
  nombreCorto: string;
  region: string | null;
}) {
  const action = actualizarAsociacion.bind(null, asociacionId);
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3.5 rounded-2xl border border-border-soft bg-card p-4.5"
    >
      <label className="flex flex-col">
        <span className={labelClass}>Nombre completo *</span>
        <input name="nombre" required defaultValue={nombre} className={inputClass} />
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col">
          <span className={labelClass}>Sigla / nombre corto *</span>
          <input name="nombreCorto" required defaultValue={nombreCorto} className={inputClass} />
        </label>
        <label className="flex flex-col">
          <span className={labelClass}>Región</span>
          <input name="region" defaultValue={region ?? ""} className={inputClass} />
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