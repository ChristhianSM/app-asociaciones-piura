import type { EstadoCategoria } from "@/types/domain";

const ESTADO_META: Record<
  EstadoCategoria,
  { label: string; color: string; bg: string; dot: string }
> = {
  por_iniciar: { label: "Por iniciar", color: "#9A6A12", bg: "#F3E7C8", dot: "#D29A2A" },
  en_curso: { label: "En curso", color: "#2E6486", bg: "#D9E8F1", dot: "#3E7FA6" },
  finalizado: { label: "Finalizado", color: "#4B6E3C", bg: "#DDE9CF", dot: "#5C8347" },
};

export function EstadoBadge({ estado }: { estado: EstadoCategoria }) {
  const meta = ESTADO_META[estado];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[10.5px] font-semibold"
      style={{ background: meta.bg, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}
