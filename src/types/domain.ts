export type EstadoCategoria = "por_iniciar" | "en_curso" | "finalizado";

export type Rol = "super_admin" | "admin_asociacion";

export interface Perfil {
  id: string;
  userId: string;
  rol: Rol;
  asociacionId: string | null;
  nombre: string;
  email: string;
}

export interface Asociacion {
  id: string;
  nombre: string;
  nombreCorto: string;
}

export interface Concurso {
  id: string;
  asociacionId: string;
  slug: string;
  nombre: string;
  sede: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface Categoria {
  id: string;
  concursoId: string;
  nombre: string;
  orden: number;
  estado: EstadoCategoria;
}

/** Subdivisión opcional dentro de una categoría (p.ej. por edad o sexo dentro de "Capones"). */
export interface Grupo {
  id: string;
  categoriaId: string;
  nombre: string;
  orden: number;
}

export interface Ejemplar {
  id: string;
  categoriaId: string;
  grupoId: string | null;
  numeroCancha: number;
  prefijo: string;
  nombre: string;
  codigoRegistro: string;
  fechaNacimiento: string;
  microchip: string | null;
  padre: string;
  madre: string;
  criador: string;
  propietario: string;
}

export type Posicion = 1 | 2 | 3 | 4 | 5;

export interface Resultado {
  id: string;
  categoriaId: string;
  ejemplarId: string;
  posicion: Posicion;
  registradoEn: string;
}
