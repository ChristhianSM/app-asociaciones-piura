"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { GrupoAdmin, EjemplarAdmin } from "@/lib/admin/data";
import type { EjemplarFormState } from "./actions";

const lbl = "font-sans text-[10.5px] text-muted-soft";
const inp =
  "h-11 w-full rounded-[10px] border border-border bg-white px-2.5 font-serif text-sm text-ink-soft outline-none focus:border-leather";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 flex-1 rounded-[11px] bg-leather font-sans text-sm font-bold text-cream disabled:opacity-60"
    >
      {pending ? "Guardando…" : label}
    </button>
  );
}

export function EjemplarForm({
  action,
  grupos,
  defaultValues,
  submitLabel,
  cancelHref,
  title,
}: {
  action: (state: EjemplarFormState, formData: FormData) => Promise<EjemplarFormState>;
  grupos: GrupoAdmin[];
  defaultValues?: EjemplarAdmin;
  submitLabel: string;
  cancelHref?: string;
  title: string;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3.5 self-start rounded-2xl border border-border-soft bg-card p-4.5"
    >
      <div className="font-display text-base text-ink">{title}</div>

      {grupos.length > 0 && (
        <label className="flex flex-col gap-1">
          <span className={lbl}>Grupo</span>
          <select name="grupoId" defaultValue={defaultValues?.grupoId ?? ""} className={inp}>
            <option value="">Sin grupo</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-leather">
        Identificación
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex flex-col gap-1">
          <span className={lbl}>N.º de cancha</span>
          <input
            name="numeroCancha"
            type="number"
            defaultValue={defaultValues?.numeroCancha ?? ""}
            className={inp}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={lbl}>Prefijo</span>
          <input name="prefijo" defaultValue={defaultValues?.prefijo ?? ""} placeholder="JCDCH" className={inp} />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className={lbl}>Nombre del ejemplar *</span>
        <input
          name="nombre"
          required
          defaultValue={defaultValues?.nombre ?? ""}
          placeholder="Don Hidalgo"
          className={inp}
        />
      </label>
      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex flex-col gap-1">
          <span className={lbl}>Código RG *</span>
          <input
            name="codigoRegistro"
            required
            defaultValue={defaultValues?.codigoRegistro ?? ""}
            placeholder="PN-12345"
            className={inp}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={lbl}>F. Nacimiento</span>
          <input
            name="fechaNacimiento"
            type="date"
            defaultValue={defaultValues?.fechaNacimiento ?? ""}
            className={inp}
          />
        </label>
      </div>

      <div className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-leather">
        Genealogía
      </div>
      <label className="flex flex-col gap-1">
        <span className={lbl}>Padre</span>
        <input name="padre" required defaultValue={defaultValues?.padre ?? ""} placeholder="OSP Imperial" className={inp} />
      </label>
      <label className="flex flex-col gap-1">
        <span className={lbl}>Madre</span>
        <input name="madre" required defaultValue={defaultValues?.madre ?? ""} placeholder="CCC Estampa" className={inp} />
      </label>

      <div className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-leather">
        Propiedad
      </div>
      <label className="flex flex-col gap-1">
        <span className={lbl}>Criador</span>
        <input
          name="criador"
          required
          defaultValue={defaultValues?.criador ?? ""}
          placeholder="Criadero La Viña"
          className={inp}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className={lbl}>Propietario</span>
        <input
          name="propietario"
          required
          defaultValue={defaultValues?.propietario ?? ""}
          placeholder="Familia Helguero Seminario"
          className={inp}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className={lbl}>Microchip</span>
        <input name="microchip" defaultValue={defaultValues?.microchip ?? ""} placeholder="991001001…" className={inp} />
      </label>

      {state?.error && (
        <div className="rounded-[11px] border border-[#E4C4B8] bg-[#F3DCD3] px-3 py-2.5 font-sans text-[12.5px] text-[#8A3B24]">
          {state.error}
        </div>
      )}

      <div className="mt-1 flex gap-2.5">
        {cancelHref && (
          <Link
            href={cancelHref}
            className="flex h-12 items-center rounded-[11px] border border-border bg-white px-4 font-sans text-sm font-semibold text-muted"
          >
            Cancelar
          </Link>
        )}
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}