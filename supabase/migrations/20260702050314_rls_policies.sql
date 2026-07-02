-- Row Level Security para los 3 roles:
--   super_admin      → control total sobre todo
--   admin_asociacion → lectura/escritura sólo de lo que pertenece a su asociación
--   público (anon)   → sólo lectura del catálogo (concursos, categorías, ejemplares, resultados)

-- ---------- Funciones helper (security definer para evitar recursión de RLS) ----------

create or replace function public.current_rol()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.perfiles where id = auth.uid();
$$;

create or replace function public.current_asociacion_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select asociacion_id from public.perfiles where id = auth.uid();
$$;

-- Asociación dueña de una categoría, resolviendo categoria → concurso → asociación.
create or replace function public.categoria_asociacion_id(p_categoria_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.asociacion_id
  from public.categorias cat
  join public.concursos c on c.id = cat.concurso_id
  where cat.id = p_categoria_id;
$$;

-- ---------- Habilitar RLS ----------

alter table public.asociaciones enable row level security;
alter table public.perfiles enable row level security;
alter table public.concursos enable row level security;
alter table public.categorias enable row level security;
alter table public.grupos enable row level security;
alter table public.ejemplares enable row level security;
alter table public.resultados enable row level security;

-- ---------- Lectura pública del catálogo ----------

create policy "publico_lectura_asociaciones" on public.asociaciones for select using (true);
create policy "publico_lectura_concursos" on public.concursos for select using (true);
create policy "publico_lectura_categorias" on public.categorias for select using (true);
create policy "publico_lectura_grupos" on public.grupos for select using (true);
create policy "publico_lectura_ejemplares" on public.ejemplares for select using (true);
create policy "publico_lectura_resultados" on public.resultados for select using (true);

-- ---------- Perfiles ----------

create policy "perfil_propio_lectura" on public.perfiles for select
  using (id = auth.uid());

create policy "super_admin_perfiles_todo" on public.perfiles for all
  using (public.current_rol() = 'super_admin')
  with check (public.current_rol() = 'super_admin');

-- ---------- Asociaciones (alta/edición sólo Super Admin) ----------

create policy "super_admin_asociaciones_todo" on public.asociaciones for all
  using (public.current_rol() = 'super_admin')
  with check (public.current_rol() = 'super_admin');

-- ---------- Concursos ----------

create policy "super_admin_concursos_todo" on public.concursos for all
  using (public.current_rol() = 'super_admin')
  with check (public.current_rol() = 'super_admin');

create policy "admin_asociacion_concursos_propios" on public.concursos for all
  using (
    public.current_rol() = 'admin_asociacion'
    and asociacion_id = public.current_asociacion_id()
  )
  with check (
    public.current_rol() = 'admin_asociacion'
    and asociacion_id = public.current_asociacion_id()
  );

-- ---------- Categorías ----------

create policy "super_admin_categorias_todo" on public.categorias for all
  using (public.current_rol() = 'super_admin')
  with check (public.current_rol() = 'super_admin');

create policy "admin_asociacion_categorias_propias" on public.categorias for all
  using (
    public.current_rol() = 'admin_asociacion'
    and exists (
      select 1 from public.concursos c
      where c.id = categorias.concurso_id and c.asociacion_id = public.current_asociacion_id()
    )
  )
  with check (
    public.current_rol() = 'admin_asociacion'
    and exists (
      select 1 from public.concursos c
      where c.id = categorias.concurso_id and c.asociacion_id = public.current_asociacion_id()
    )
  );

-- ---------- Grupos ----------

create policy "super_admin_grupos_todo" on public.grupos for all
  using (public.current_rol() = 'super_admin')
  with check (public.current_rol() = 'super_admin');

create policy "admin_asociacion_grupos_propios" on public.grupos for all
  using (
    public.current_rol() = 'admin_asociacion'
    and public.categoria_asociacion_id(categoria_id) = public.current_asociacion_id()
  )
  with check (
    public.current_rol() = 'admin_asociacion'
    and public.categoria_asociacion_id(categoria_id) = public.current_asociacion_id()
  );

-- ---------- Ejemplares ----------

create policy "super_admin_ejemplares_todo" on public.ejemplares for all
  using (public.current_rol() = 'super_admin')
  with check (public.current_rol() = 'super_admin');

create policy "admin_asociacion_ejemplares_propios" on public.ejemplares for all
  using (
    public.current_rol() = 'admin_asociacion'
    and public.categoria_asociacion_id(categoria_id) = public.current_asociacion_id()
  )
  with check (
    public.current_rol() = 'admin_asociacion'
    and public.categoria_asociacion_id(categoria_id) = public.current_asociacion_id()
  );

-- ---------- Resultados ----------

create policy "super_admin_resultados_todo" on public.resultados for all
  using (public.current_rol() = 'super_admin')
  with check (public.current_rol() = 'super_admin');

create policy "admin_asociacion_resultados_propios" on public.resultados for all
  using (
    public.current_rol() = 'admin_asociacion'
    and public.categoria_asociacion_id(categoria_id) = public.current_asociacion_id()
  )
  with check (
    public.current_rol() = 'admin_asociacion'
    and public.categoria_asociacion_id(categoria_id) = public.current_asociacion_id()
  );
