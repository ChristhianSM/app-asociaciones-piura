// Crea una asociación de prueba con su admin, un concurso "en curso",
// varias categorías (una con grupos) y ejemplares con datos ficticios,
// más resultados ya cargados en una de las categorías. Usa la
// service_role key para saltarse RLS (solo para uso local/desarrollo).
//
// Uso: node scripts/seed-fake-data.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([\w.]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hoyMasDias(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

const sufijo = Date.now().toString().slice(-6);

const CRIADORES = ["Criadero La Viña", "Fundo Los Algarrobos", "Establo San Miguel", "Hacienda El Chalán"];
const PROPIETARIOS = [
  "Familia Helguero Seminario",
  "Familia Zapata Rivas",
  "Juan Carlos Ipanaqué",
  "Rosa Elvira Chumacero",
];
const PREFIJOS = ["JCDCH", "OSP", "CCC", "HLZ", "PNP"];
const NOMBRES_CABALLO = [
  "Don Hidalgo",
  "Imperial",
  "Estampa",
  "Cautivo",
  "Faraón",
  "Embrujo",
  "Distinguido",
  "Añañay",
];

async function main() {
  console.log("Creando asociación de prueba...");
  const { data: asociacion, error: asocError } = await supabase
    .from("asociaciones")
    .insert({
      nombre: `Asociación de Prueba ${sufijo}`,
      nombre_corto: `Prueba ${sufijo}`,
      region: "Piura",
    })
    .select("id")
    .single();

  if (asocError) throw asocError;

  const adminEmail = `seed-admin-${sufijo}@example.com`;
  const adminPassword = "Prueba123!";

  console.log("Creando usuario admin de la asociación...");
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });
  if (userError) throw userError;

  const { error: perfilError } = await supabase.from("perfiles").insert({
    id: userData.user.id,
    rol: "admin_asociacion",
    asociacion_id: asociacion.id,
    nombre: "Admin de Prueba",
    email: adminEmail,
  });
  if (perfilError) throw perfilError;

  console.log("Creando concurso...");
  const nombreConcurso = `I Concurso de Prueba ${sufijo}`;
  const { data: concurso, error: concError } = await supabase
    .from("concursos")
    .insert({
      asociacion_id: asociacion.id,
      slug: slugify(nombreConcurso),
      nombre: nombreConcurso,
      sede: "Coliseo Las Capullanas · Piura",
      fecha_inicio: hoyMasDias(-1),
      fecha_fin: hoyMasDias(2),
    })
    .select("id")
    .single();
  if (concError) throw concError;

  const categoriasDef = [
    { tipo_animal: "Capones", modalidad: "Freno y Espuelas", rango_edad: "4 a 10 años", nGrupos: 0 },
    { tipo_animal: "Yeguas", modalidad: "Freno y Espuelas", rango_edad: "4 a 10 años", nGrupos: 2 },
    { tipo_animal: "Potrancas", modalidad: "Bozal", rango_edad: "1 a 3 años", nGrupos: 0 },
  ];

  console.log("Creando categorías y ejemplares...");
  for (let i = 0; i < categoriasDef.length; i++) {
    const def = categoriasDef[i];
    const nombre = `${def.tipo_animal} · ${def.modalidad} · ${def.rango_edad}`;

    const { data: categoria, error: catError } = await supabase
      .from("categorias")
      .insert({
        concurso_id: concurso.id,
        nombre,
        orden: i,
        tipo_animal: def.tipo_animal,
        modalidad: def.modalidad,
        rango_edad: def.rango_edad,
      })
      .select("id")
      .single();
    if (catError) throw catError;

    let grupoIds = [];
    if (def.nGrupos > 0) {
      const grupos = Array.from({ length: def.nGrupos }, (_, g) => ({
        categoria_id: categoria.id,
        nombre: `Grupo ${g + 1}`,
        orden: g,
      }));
      const { data: gruposCreados, error: grupoError } = await supabase
        .from("grupos")
        .insert(grupos)
        .select("id");
      if (grupoError) throw grupoError;
      grupoIds = gruposCreados.map((g) => g.id);
    }

    const ejemplaresCreados = [];
    for (let n = 1; n <= 6; n++) {
      const { data: ejemplar, error: ejError } = await supabase
        .from("ejemplares")
        .insert({
          categoria_id: categoria.id,
          grupo_id: grupoIds.length ? grupoIds[n % grupoIds.length] : null,
          numero_cancha: n,
          prefijo: PREFIJOS[n % PREFIJOS.length],
          nombre: `${NOMBRES_CABALLO[(i * 6 + n) % NOMBRES_CABALLO.length]} ${n}`,
          codigo_registro: `PN-${10000 + i * 100 + n}`,
          fecha_nacimiento: hoyMasDias(-365 * (3 + (n % 5))),
          padre: `${PREFIJOS[(n + 1) % PREFIJOS.length]} ${NOMBRES_CABALLO[n % NOMBRES_CABALLO.length]}`,
          madre: `${PREFIJOS[(n + 2) % PREFIJOS.length]} ${NOMBRES_CABALLO[(n + 3) % NOMBRES_CABALLO.length]}`,
          criador: CRIADORES[n % CRIADORES.length],
          propietario: PROPIETARIOS[n % PROPIETARIOS.length],
        })
        .select("id")
        .single();
      if (ejError) throw ejError;
      ejemplaresCreados.push(ejemplar.id);
    }

    // La primera categoría queda finalizada con resultados 1-3 cargados.
    if (i === 0) {
      for (let p = 0; p < 3; p++) {
        await supabase
          .from("resultados")
          .insert({ categoria_id: categoria.id, ejemplar_id: ejemplaresCreados[p], posicion: p + 1 });
      }
      await supabase.from("categorias").update({ estado: "finalizado" }).eq("id", categoria.id);
    } else if (i === 1) {
      await supabase.from("categorias").update({ estado: "en_curso" }).eq("id", categoria.id);
    }
  }

  console.log("\nListo. Datos de prueba creados:");
  console.log(`  Asociación: ${asociacion.id}`);
  console.log(`  Concurso:   /c/${slugify(nombreConcurso)}`);
  console.log(`  Admin:      ${adminEmail} / ${adminPassword}`);
}

main().catch((err) => {
  console.error("Error generando datos de prueba:", err.message ?? err);
  process.exit(1);
});