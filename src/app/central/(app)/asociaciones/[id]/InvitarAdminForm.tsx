"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { invitarAdmin } from "./actions";

const inputClass =
  "h-10 w-full rounded-[9px] border border-border bg-white px-3 font-serif text-[13.5px] text-ink-soft outline-none focus:border-leather";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-10 rounded-[9px] bg-ink-soft px-4 font-sans text-[12.5px] font-semibold text-[#F2E9D6] disabled:opacity-60"
    >
      {pending ? "Invitando…" : "Invitar"}
    </button>
  );
}

export function InvitarAdminForm({ asociacionId }: { asociacionId: string }) {
  const [open, setOpen] = useState(false);
  const action = invitarAdmin.bind(null, asociacionId);
  const [state, formAction] = useActionState(action, undefined);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="h-[34px] rounded-[9px] border border-border bg-card px-3.5 font-sans text-xs font-semibold text-ink-soft"
      >
        + Invitar
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="flex w-full flex-col gap-2 rounded-[13px] border border-border-soft bg-card p-3"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input name="nombre" required placeholder="Nombre" className={inputClass} />
        <input name="email" type="email" required placeholder="Correo" className={inputClass} />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Contraseña temporal"
          className={inputClass}
        />
      </div>
      {state?.error && <p className="font-sans text-xs text-leather-dark">{state.error}</p>}
      <div className="flex gap-2">
        <SubmitButton />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-10 rounded-[9px] border border-border px-4 font-sans text-xs font-semibold text-muted"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}