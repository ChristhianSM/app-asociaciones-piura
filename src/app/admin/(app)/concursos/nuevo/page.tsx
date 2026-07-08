import Link from "next/link";
import { NuevoConcursoForm } from "./NuevoConcursoForm";

export default function NuevoConcursoPage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-6 sm:px-10">
      <Link href="/admin/dashboard" className="font-sans text-[13px] font-semibold text-muted-soft">
        ‹ Mis concursos
      </Link>
      <h1 className="mb-1.5 mt-2 font-display text-[clamp(23px,3.4vw,30px)] text-ink">Crear concurso</h1>
      <p className="mb-5 font-serif text-sm italic text-muted">
        El concurso se crea &quot;por iniciar&quot;. Luego agregas categorías y sus ejemplares, y cuando
        arranque lo pasas a &quot;en curso&quot;.
      </p>

      <NuevoConcursoForm />
    </main>
  );
}