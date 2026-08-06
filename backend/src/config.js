/**
 * Acceso a la configuración.
 *
 * Se lee con funciones y no con constantes de módulo a propósito: en workerd
 * las variables sólo están pobladas dentro de un contexto de request, así que
 * leerlas al importar el módulo daría `undefined`.
 */

const read = (name) => process.env[name];

const required = (name) => {
  const value = read(name);
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
};

export const mongoUri = () => required("MONGO_URI");
export const jwtSecret = () => required("JWT_SECRET");

export const cloudinary = () => ({
  cloudName: required("CLOUDINARY_CLOUD_NAME"),
  apiKey: required("CLOUDINARY_API_KEY"),
  apiSecret: required("CLOUDINARY_API_SECRET"),
  folder: read("CLOUDINARY_FOLDER") || "artesanos-online",
});

/** Stripe quedó desactivado; el endpoint responde 503 mientras no haya clave. */
export const stripeSecretKey = () => {
  const value = read("STRIPE_SECRET_KEY");
  return value && value !== "deprecated" ? value : null;
};
