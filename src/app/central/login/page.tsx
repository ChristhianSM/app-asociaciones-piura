import { LoginForm } from "./LoginForm";

export default function CentralLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-hide-dark px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-hide p-8 text-center text-cream">
        <h1 className="font-display text-2xl">Acceso Central</h1>
        <p className="mt-2 font-sans text-sm text-cream/60">Inicia sesión como Super Admin.</p>
        <LoginForm />
      </div>
    </main>
  );
}
