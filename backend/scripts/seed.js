/**
 * Siembra las categorías del catálogo.
 *
 * Corre en Node, no en el Worker: sube las imágenes de `uploads/` a Cloudinary
 * y guarda las URLs en Mongo. Idempotente — vuelve a subir y reemplaza la
 * colección `menus` entera.
 *
 *   pnpm --filter backend seed
 *
 * Lee las credenciales de `.dev.vars` (o del entorno, que tiene prioridad).
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const here = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(here, "..");

// --- Configuración: .dev.vars primero, el entorno manda ------------------
const loadDevVars = async () => {
  let raw;
  try {
    raw = await readFile(join(backendRoot, ".dev.vars"), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (process.env[key] === undefined) {
      process.env[key] = value.trim().replace(/^["']|["']$/g, "");
    }
  }
};

await loadDevVars();

// Los módulos que leen process.env se importan DESPUÉS de poblarlo.
const { uploadImage } = await import("../src/lib/cloudinary.js");
const { connectionStore } = await import("../src/db/requestScopedModel.js");
const { default: menuModel } = await import("../src/models/menuModel.js");

// --- Datos ---------------------------------------------------------------
// Las ocho categorías originales de seeMenu.js, con su imagen en uploads/.
const CATEGORIES = [
  { menu_name: "Cerámica", file: "menu_1.png" },
  { menu_name: "Textiles", file: "menu_2.png" },
  { menu_name: "Cestería", file: "menu_3.png" },
  { menu_name: "Tallado", file: "menu_4.png" },
  { menu_name: "Joyería", file: "menu_5.png" },
  { menu_name: "Vidrio", file: "menu_6.png" },
  { menu_name: "Cartonería", file: "menu_7.png" },
  { menu_name: "Pintura", file: "menu_8.png" },
];

const toDataUri = async (file) => {
  const bytes = await readFile(join(backendRoot, "uploads", file));
  return `data:image/png;base64,${bytes.toString("base64")}`;
};

// --- Ejecución -----------------------------------------------------------
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Falta MONGO_URI (ponla en backend/.dev.vars o en el entorno)");
  process.exit(1);
}

const connection = mongoose.createConnection(uri, { serverSelectionTimeoutMS: 15_000 });
await connection.asPromise();
console.log("Conectado a MongoDB");

try {
  await connectionStore.run(connection, async () => {
    const documents = [];

    for (const { menu_name, file } of CATEGORIES) {
      const { url } = await uploadImage(await toDataUri(file), "categories");
      console.log(`  ${menu_name} -> ${url}`);
      documents.push({ menu_name, menu_image: url });
    }

    await menuModel.deleteMany({});
    await menuModel.insertMany(documents);
  });

  console.log(`Listo: ${CATEGORIES.length} categorías sembradas`);
} finally {
  await connection.close();
}
