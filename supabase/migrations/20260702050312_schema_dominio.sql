-- Esquema de dominio: Asociación → Concurso → Categoría → (Grupo, opcional) → Ejemplar → Resultado
-- más Perfiles de usuario (Super Admin / Admin de Asociación) sobre auth.users de Supabase.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ========== ASOCIACIONES ==========

create table public.asociaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nombre_corto text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.asociaciones
  for each row execute function public.set_updated_at();

-- ========== PERFILES ==========
-- Extiende auth.users. Las filas se crean explícitamente desde la app
-- (el Super Admin invita admins de asociación); no hay alta automática.

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  rol text not null check (rol in ('super_admin', 'admin_asociacion')),
  asociacion_id uuid references public.asociaciones (id) on delete set null,
  nombre text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_asociacion_requiere_asociacion
    check (rol = 'super_admin' or asociacion_id is not null)
);

create trigger set_updated_at
  before update on public.perfiles
  for each row execute function public.set_updated_at();

-- ========== CONCURSOS ==========

create table public.concursos (
  id uuid primary key default gen_random_uuid(),
  asociacion_id uuid not null references public.asociaciones (id) on delete cascade,
  slug text not null unique,
  nombre text not null,
  sede text not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fechas_validas check (fecha_fin >= fecha_inicio)
);

create index concursos_asociacion_id_idx on public.concursos (asociacion_id);

create trigger set_updated_at
  before update on public.concursos
  for each row execute function public.set_updated_at();

-- ========== CATEGORÍAS ==========

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  concurso_id uuid not null references public.concursos (id) on delete cascade,
  nombre text not null,
  orden integer not null default 0,
  estado text not null default 'por_iniciar'
    check (estado in ('por_iniciar', 'en_curso', 'finalizado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categorias_concurso_id_idx on public.categorias (concurso_id);

create trigger set_updated_at
  before update on public.categorias
  for each row execute function public.set_updated_at();

-- ========== GRUPOS ==========
-- Subdivisión opcional dentro de una categoría (p. ej. por edad o sexo dentro de "Capones").

create table public.grupos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias (id) on delete cascade,
  nombre text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  -- permite la FK compuesta de ejemplares (grupo_id, categoria_id) más abajo,
  -- que exige que un grupo referenciado pertenezca a la misma categoría del ejemplar.
  unique (id, categoria_id)
);

create index grupos_categoria_id_idx on public.grupos (categoria_id);

-- ========== EJEMPLARES ==========

create table public.ejemplares (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias (id) on delete cascade,
  grupo_id uuid,
  numero_cancha integer,
  prefijo text not null,
  nombre text not null,
  codigo_registro text not null,
  fecha_nacimiento date,
  microchip text,
  padre text not null,
  madre text not null,
  criador text not null,
  propietario text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Si se borra el grupo, el ejemplar queda sin grupo (no bloquea el delete ni
  -- arrastra el borrado del ejemplar). Requiere Postgres 15+, ya el default en Supabase.
  constraint ejemplares_grupo_categoria_fk
    foreign key (grupo_id, categoria_id) references public.grupos (id, categoria_id)
    on delete set null (grupo_id)
);

create index ejemplares_categoria_id_idx on public.ejemplares (categoria_id);
create index ejemplares_grupo_id_idx on public.ejemplares (grupo_id);

create trigger set_updated_at
  before update on public.ejemplares
  for each row execute function public.set_updated_at();

-- ========== RESULTADOS ==========

create table public.resultados (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias (id) on delete cascade,
  ejemplar_id uuid not null references public.ejemplares (id) on delete cascade,
  posicion smallint not null check (posicion between 1 and 5),
  registrado_en timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (categoria_id, ejemplar_id),
  unique (categoria_id, posicion)
);

create index resultados_categoria_id_idx on public.resultados (categoria_id);

create trigger set_updated_at
  before update on public.resultados
  for each row execute function public.set_updated_at();
