import { cloudinary } from "../config.js";

/**
 * Cloudinary sin el SDK de Node.
 *
 * El SDK oficial usa el módulo `http` de Node y streams; en Workers lo fiable
 * es llamar a la API REST con `fetch` y firmar la petición a mano con
 * WebCrypto. Sustituye a multer + el disco local, que en workerd no existe.
 */

const sha1Hex = async (input) => {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Cloudinary firma los parámetros ordenados alfabéticamente, excluyendo
 * `file`, `api_key` y `resource_type`, concatenando el api_secret al final.
 */
const sign = (params, apiSecret) => {
  const canonical = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return sha1Hex(`${canonical}${apiSecret}`);
};

const call = async (endpoint, params, extra = {}) => {
  const { cloudName, apiKey, apiSecret } = cloudinary();
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { ...params, timestamp };

  const form = new FormData();
  for (const [key, value] of Object.entries({ ...signed, ...extra })) {
    form.append(key, String(value));
  }
  form.append("api_key", apiKey);
  form.append("signature", await sign(signed, apiSecret));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/${endpoint}`,
    { method: "POST", body: form },
  );

  if (!response.ok) {
    throw new Error(`Cloudinary respondió ${response.status}: ${await response.text()}`);
  }
  return response.json();
};

/**
 * @param {string} dataUri    imagen en base64 (`data:image/png;base64,...`)
 * @param {string} [subfolder] p.ej. "crafts" o "categories"
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (dataUri, subfolder = "crafts") => {
  const { folder } = cloudinary();
  // `file` no entra en la firma, por eso va aparte.
  const result = await call("upload", { folder: `${folder}/${subfolder}` }, { file: dataUri });

  if (!result.secure_url || !result.public_id) {
    throw new Error("Cloudinary no devolvió secure_url");
  }
  return { url: result.secure_url, publicId: result.public_id };
};

/** Borrar es "best effort": si falla, el producto se elimina igualmente. */
export const destroyImage = async (publicId) => {
  if (!publicId) return;
  try {
    await call("destroy", { public_id: publicId });
  } catch (error) {
    console.error("No se pudo borrar la imagen de Cloudinary:", error);
  }
};

const DATA_URI = /^data:image\/(png|jpe?g|webp|gif|avif);base64,[a-z0-9+/=\s]+$/i;

export const isImageDataUri = (value) => typeof value === "string" && DATA_URI.test(value);
