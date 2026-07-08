import Link from "next/link";
import { NuevaAsociacionForm } from "./NuevaAsociacionForm";

export default function NuevaAsociacionPage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-6 sm:px-10">
      <Link href="/central/asociaciones" className="font-sans text-[13px] font-semibold text-muted-soft">
        ‹ Asociaciones
      </Link>
      <div className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
        Panel central
      </div>
      <h1 className="mt-1 font-display text-[clamp(23px,3.4vw,30px)] text-ink">Nueva asociación</h1>
      <p className="mb-5 mt-1.5 font-serif text-sm italic text-muted">
        Registra la asociación y crea el acceso de su administrador. Con ese usuario y contraseña
        entrará a gestionar sus propios concursos.
      </p>

      <NuevaAsociacionForm />
    </main>
  );
}