import type { Concurso, EstadoCategoria } from "@/types/domain";

export interface CategoriaResumen {
  id: string;
  nombre: string;
  grupo: string;
  estado: EstadoCategoria;
  count: number;
}

export interface ConcursoLandingData {
  concurso: Concurso;
  asociacionNombre: string;
  totalPruebas: number;
  categorias: CategoriaResumen[];
}

/** Datos de ejemplo — reemplazar por una consulta a Supabase cuando exista el proyecto. */
export function getMockConcursoLanding(slug: string): ConcursoLandingData {
  const categorias: CategoriaResumen[] = [
    {
      id: "cat-1",
      nombre: "Potrancas de 2 a 3 años",
      grupo: "Ejemplares jóvenes",
      estado: "en_curso",
      count: 14,
    },
    {
      id: "cat-2",
      nombre: "Potrillos de 2 a 3 años",
      grupo: "Ejemplares jóvenes",
      estado: "por_iniciar",
      count: 11,
    },
    {
      id: "cat-3",
      nombre: "Capones en Freno y Espuelas",
      grupo: "Ejemplares adultos",
      estado: "finalizado",
      count: 9,
    },
    {
      id: "cat-4",
      nombre: "Yeguas de vientre en Bozal",
      grupo: "Ejemplares adultos",
      estado: "en_curso",
      count: 8,
    },
  ];

  return {
    concurso: {
      id: "conc-1",
      asociacionId: "asoc-1",
      slug,
      nombre: "LXXIX Concurso Regional de Caballo Peruano de Paso",
      sede: "Fundo Los Algarrobos, Piura",
      fechaInicio: "2026-08-14",
      fechaFin: "2026-08-16",
    },
    asociacionNombre: "A.C.P.C.P. Piura",
    totalPruebas: categorias.length,
    categorias,
  };
}
