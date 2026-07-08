"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { crearAsociacion } from "./actions";

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
      {pending ? "Creando…" : "Crear asociación"}
    </button>
  );
}

export function NuevaAsociacionForm() {
  const [state, formAction] = useActionState(crearAsociacion, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3.5 rounded-2xl border border-border-soft bg-card p-4.5"
    >
      <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
        Datos de la asociación
      </div>
      <label className="flex flex-col">
        <span className={labelClass}>Nombre completo *</span>
        <input
          name="nombre"
          required
          placeholder="Asoc. de Criadores y Prop. de Caballos de Paso de…"
          className={inputClass}
        />
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col">
          <span className={labelClass}>Sigla / nombre corto *</span>
          <input name="nombreCorto" required placeholder="A.C.C.P. — Piura" className={inputClass} />
        </label>
        <label className="flex flex-col">
          <span className={labelClass}>Región</span>
          <input name="region" placeholder="Piura" className={inputClass} />
        </label>
      </div>

      <div className="mt-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
        Acceso del administrador
      </div>
      <label className="flex flex-col">
        <span className={labelClass}>Nombre del administrador *</span>
        <input name="adminNombre" required placeholder="Nombre y apellido" className={inputClass} />
      </label>
      <label className="flex flex-col">
        <span className={labelClass}>Correo del administrador *</span>
        <input
          name="adminEmail"
          type="email"
          required
          placeholder="admin@asociacion.pe"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col">
        <span className={labelClass}>Contraseña temporal *</span>
        <input
          name="adminPassword"
          type="password"
          required
          minLength={6}
          placeholder="Al menos 6 caracteres"
          className={inputClass}
        />
      </label>

      {state?.error && (
        <div className="rounded-[11px] border border-[#E4C4B8] bg-[#F3DCD3] px-3 py-2.5 font-sans text-[12.5px] text-[#8A3B24]">
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}