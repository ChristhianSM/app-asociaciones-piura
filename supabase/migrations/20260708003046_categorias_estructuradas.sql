-- La categoría se arma eligiendo tipo de animal, modalidad y rango de
-- edad por separado (en vez de escribir el nombre libre); "nombre" se
-- sigue guardando como el texto compuesto para no romper el resto del
-- esquema (resultados, listados, etc. ya dependen de un nombre único
-- por categoría).

alter table public.categorias
  add column tipo_animal text,
  add column modalidad text,
  add column rango_edad text;