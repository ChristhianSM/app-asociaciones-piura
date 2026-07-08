-- Campos reales de negocio que faltaban en asociaciones: región (para
-- búsqueda/filtro en el panel central) y activo (para poder suspender
-- una asociación sin borrar sus datos).

alter table public.asociaciones
  add column region text,
  add column activo boolean not null default true;