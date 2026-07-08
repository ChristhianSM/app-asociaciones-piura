import Link from "next/link";
import type { AsociacionResumen } from "@/lib/central/data";

export function AsociacionRow({ asociacion }: { asociacion: AsociacionResumen }) {
  return (
    <Link
      href={`/central/asociaciones/${asociacion.id}`}
      className="flex items-center gap-3.5 rounded-[13px] border border-border-soft bg-card p-3.5 transition hover:bg-white"
    >
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-gradient-to-br from-hide to-[#4a4234] font-display text-[16px] text-gold-lighter">
        {asociacion.nombreCorto.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-serif text-[15px] font-semibold text-ink-soft">
          {asociacion.nombreCorto}
        </div>
        <div className="font-sans text-[11px] text-muted-soft">
          {asociacion.region ?? "Sin región"} · {asociacion.nConcursos} concursos · {asociacion.nAdmins}{" "}
          admins
        </div>
      </div>
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
      <span className="text-[17px] text-border">›</span>
    </Link>
  );
}