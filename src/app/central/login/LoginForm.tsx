"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginSuperAdmin } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 h-11 w-full rounded-[11px] bg-leather font-sans text-[13px] font-semibold text-cream disabled:opacity-60"
    >
      {pending ? "Ingresando…" : "Ingresar"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginSuperAdmin, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-3 text-left">
      <div>
        <label htmlFor="email" className="font-sans text-xs font-semibold text-cream/70">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 h-11 w-full rounded-[11px] border border-white/15 bg-white/5 px-3.5 font-serif text-sm text-cream outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="password" className="font-sans text-xs font-semibold text-cream/70">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 h-11 w-full rounded-[11px] border border-white/15 bg-white/5 px-3.5 font-serif text-sm text-cream outline-none focus:border-white/30"
        />
      </div>

      {state?.error && <p className="font-sans text-xs text-red-400">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}