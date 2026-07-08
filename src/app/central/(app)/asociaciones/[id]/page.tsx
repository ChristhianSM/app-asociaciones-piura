import Link from "next/link";
import { notFound } from "next/navigation";
import { getAsociacion, getConcursos, getAdminsDeAsociacion } from "@/lib/central/data";
import { EstadoBadge } from "@/components/ui/EstadoBadge";
import { InvitarAdminForm } from "./InvitarAdminForm";
import { toggleActivoAsociacion } from "./actions";

function formatFechas(inicio: string, fin: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const inicioStr = new Date(`${inicio}T00:00:00`).toLocaleDateString("es-PE", opts);
  const finStr = new Date(`${fin}T00:00:00`).toLocaleDateString("es-PE", { ...opts, year: "numeric" });
  return `${inicioStr} – ${finStr}`;
}

export default async function AsociacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asociacion = await getAsociacion(id);

  if (!asociacion) {
    notFound();
  }

  const [concursos, admins] = await Promise.all([getConcursos(id), getAdminsDeAsociacion(id)]);
  const concursosEnCurso = concursos.filter((c) => c.estado === "en_curso").length;
  const nEjemplares = concursos.reduce((sum, c) => sum + c.nEjemplares, 0);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6 sm:px-10">
      <Link href="/central/asociaciones" className="font-sans text-[13px] font-semibold text-muted-soft">
        ‹ Asociaciones
      </Link>

      <div className="mt-2.5 flex flex-wrap items-start gap-4 rounded-[18px] bg-gradient-to-br from-hide to-[#473d2d] p-5 text-[#EDE4D2] sm:p-6">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-[13px] bg-gradient-to-br from-gold-light to-gold-dark font-display text-2xl text-[#1a140a]">
          {asociacion.nombre_corto.charAt(0)}
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-light">
            {asociacion.region ?? "Sin región"}
          </div>
          <h1 className="mt-0.5 font-display text-[clamp(20px,3vw,27px)] leading-tight text-[#FBF4E3]">
            {asociacion.nombre}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span
              className={
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[10.5px] font-semibold " +
                (asociacion.activo ? "bg-field-lighter text-field" : "bg-[#F3DCD3] text-leather-dark")
              }
            >
              <span
                className={"h-1.5 w-1.5 rounded-full " + (asociacion.activo ? "bg-field-light" : "bg-leather")}
              />
              {asociacion.activo ? "Activa" : "Suspendida"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <Link
          href={`/central/asociaciones/${id}/editar`}
          className="flex h-[46px] items-center rounded-xl border border-border bg-card px-4 font-sans text-[13px] font-semibold text-ink-soft"
        >
          Editar datos
        </Link>
        <form action={toggleActivoAsociacion.bind(null, id, !asociacion.activo)}>
          <button
            type="submit"
            className={
              "flex h-[46px] items-center rounded-xl px-4 font-sans text-[13px] font-semibold " +
              (asociacion.activo
                ? "border border-border bg-card text-leather-dark"
                : "bg-leather text-cream")
            }
          >
            {asociacion.activo ? "Suspender asociación" : "Activar asociación"}
          </button>
        </form>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-3">
        <div className="rounded-[15px] border border-border-soft bg-card p-3.5">
          <div className="font-display text-2xl text-ink-soft">{concursos.length}</div>
          <div className="font-sans text-[11.5px] text-muted-soft">concursos</div>
        </div>
        <div className="rounded-[15px] border border-sky-light/40 bg-sky-lighter p-3.5">
          <div className="font-display text-2xl text-sky">{concursosEnCurso}</div>
          <div className="font-sans text-[11.5px] text-sky">en curso</div>
        </div>
        <div className="rounded-[15px] border border-border-soft bg-card p-3.5">
          <div className="font-display text-2xl text-ink-soft">{nEjemplares}</div>
          <div className="font-sans text-[11.5px] text-muted-soft">ejemplares</div>
        </div>
      </div>

      <div className="mb-2.5 mt-6 flex items-center gap-3">
        <h2 className="whitespace-nowrap font-display text-lg text-[#5C5347]">Concursos</h2>
        <span className="h-px flex-1 bg-border-soft" />
      </div>
      {concursos.length === 0 ? (
        <p className="font-sans text-sm text-muted">Esta asociación todavía no tiene concursos.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {concursos.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-[13px] border border-border-soft bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-serif text-[15px] font-semibold text-ink-soft">{c.nombre}</div>
                <div className="font-sans text-[11px] text-muted-soft">
                  {formatFechas(c.fechaInicio, c.fechaFin)} · {c.nCategorias} categorías · {c.nEjemplares}{" "}
                  ejemplares
                </div>
              </div>
              <EstadoBadge estado={c.estado} />
            </div>
          ))}
        </div>
      )}

      <div className="mb-2.5 mt-6 flex items-center gap-3">
        <h2 className="whitespace-nowrap font-display text-lg text-[#5C5347]">Administradores</h2>
        <span className="h-px flex-1 bg-border-soft" />
        <InvitarAdminForm asociacionId={id} />
      </div>
      {admins.length === 0 ? (
        <p className="font-sans text-sm text-muted">Todavía no hay administradores invitados.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {admins.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 rounded-[13px] border border-border-soft bg-card p-3"
            >
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-border-soft font-display text-sm text-muted">
                {u.nombre.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-serif text-[14.5px] font-semibold text-ink-soft">{u.nombre}</div>
                <div className="truncate font-sans text-[11.5px] text-muted-soft">{u.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}