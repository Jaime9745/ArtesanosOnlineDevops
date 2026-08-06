import mongoose from "mongoose";
import { mongoUri } from "../config.js";

/**
 * Conexión a MongoDB en Cloudflare Workers: una por request.
 *
 * workerd no permite compartir un socket entre requests. Tampoco vale
 * compartir una conexión entre requests concurrentes: el monitor de topología
 * del driver pertenece al contexto de I/O del request que la abrió, así que en
 * cuanto ése termina, los que la siguen usando se cuelgan.
 *
 * Abrir y cerrar tiene que ocurrir dentro del handler, con el contexto de I/O
 * vivo. Cerrando desde `res.on('finish')` —ya enviada la respuesta— el
 * disconnect se queda pendiente para siempre.
 */
const CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 20_000,
  maxPoolSize: 1,
  minPoolSize: 0,
};

export const openConnection = async () => {
  const connection = mongoose.createConnection(mongoUri(), CONNECT_OPTIONS);
  await connection.asPromise();
  return connection;
};

export const closeConnection = async (connection) => {
  if (!connection) return;
  try {
    await connection.close();
  } catch (error) {
    console.error("Error cerrando la conexión a MongoDB:", error);
  }
};
