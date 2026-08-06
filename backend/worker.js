import express from "express";
import cors from "cors";
import { httpServerHandler } from "cloudflare:node";
import { connectionStore } from "./src/db/requestScopedModel.js";

const app = express();

app.use(cors());
// 5mb: el admin manda la imagen como data URI en base64 (un JPEG de ~500kb
// pesa ~670kb ya codificado) y un Worker sólo tiene 128mb por isolate.
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.get("/", (_req, res) => {
  res.send("API ArtesanosOnline funcionando correctamente");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", runtime: "cloudflare-workers" });
});

/**
 * Puente de contexto. `httpServerHandler` habla con Express por un socket, así
 * que el AsyncLocalStorage del handler del Worker no llega hasta aquí: se pasa
 * el identificador de la conexión en una cabecera y este middleware vuelve a
 * entrar en el contexto antes de tocar ninguna ruta.
 */
const CONNECTION_HEADER = "x-worker-connection-id";
const pendingConnections = new Map();

app.use((req, _res, next) => {
  const id = req.headers[CONNECTION_HEADER];
  const connection = typeof id === "string" ? pendingConnections.get(id) : undefined;

  if (!connection) {
    next();
    return;
  }
  connectionStore.run(connection, () => next());
});

/**
 * Las rutas se cargan dentro del primer request y no en el scope global:
 * `bson` genera bytes aleatorios en un static initializer, y workerd prohíbe
 * la aleatoriedad y la I/O fuera de un contexto de request.
 */
let routesLoaded = null;

const loadRoutes = () => {
  if (!routesLoaded) {
    routesLoaded = import("./src/routes/index.js")
      .then(({ setupRoutes }) => setupRoutes(app))
      .catch((err) => {
        // No dejamos la promesa fallida en caché: el siguiente request reintenta.
        routesLoaded = null;
        throw err;
      });
  }
  return routesLoaded;
};

app.listen(3000);

const nodeHandler = httpServerHandler({ port: 3000 });

const dispatch = (request, env, ctx) => nodeHandler.fetch(request, env, ctx);

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    // Las rutas que no tocan la base de datos se sirven sin abrir conexión.
    if (!pathname.startsWith("/api/")) {
      return dispatch(request, env, ctx);
    }

    const [{ openConnection, closeConnection }] = await Promise.all([
      import("./src/db/connection.js"),
      loadRoutes(),
    ]);

    const connectionId = crypto.randomUUID();
    let connection = null;

    try {
      connection = await openConnection();
      pendingConnections.set(connectionId, connection);

      const proxied = new Request(request);
      proxied.headers.set(CONNECTION_HEADER, connectionId);

      const response = await dispatch(proxied, env, ctx);

      // El cuerpo se consume aquí para que Express (y sus consultas a Mongo)
      // haya terminado antes de cerrar la conexión. Cerrándola después de
      // devolver la respuesta, el close se queda pendiente para siempre.
      const body = await response.arrayBuffer();

      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } catch (err) {
      console.error("Error atendiendo el request:", err);
      return Response.json({ success: false, message: "Error interno del servidor" }, { status: 500 });
    } finally {
      pendingConnections.delete(connectionId);
      await closeConnection(connection);
    }
  },
};
