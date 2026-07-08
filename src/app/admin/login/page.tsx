import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_50%_-10%,#3a342a_0%,#2A2620_60%)] px-6">
      <div className="w-full max-w-sm rounded-2xl bg-cream p-8 text-ink">
        <h1 className="font-display text-2xl">Ingresar al panel</h1>
        <p className="mt-2 font-serif text-sm text-muted">
          Ingresa con tu cuenta de administrador de asociación.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
