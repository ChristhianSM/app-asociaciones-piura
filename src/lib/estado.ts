import type { EstadoCategoria } from "@/types/domain";

export function estadoPorFechas(fechaInicio: string, fechaFin: string): EstadoCategoria {
  const hoy = new Date().toISOString().slice(0, 10);
  if (fechaFin < hoy) return "finalizado";
  if (fechaInicio > hoy) return "por_iniciar";
  return "en_curso";
}