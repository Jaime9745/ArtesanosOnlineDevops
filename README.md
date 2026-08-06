# ArtesanosOnline

Tienda de artesanía. Monorepo con workspace de pnpm y tres paquetes:

| Paquete    | Qué es                  | Dónde vive          | URL |
|------------|-------------------------|---------------------|-----|
| `frontend` | Tienda (React + Vite)   | Vercel              | https://artesanosonline-frontend.vercel.app |
| `admin`    | Panel de gestión        | Vercel              | https://artesanosonline-admin.vercel.app |
| `backend`  | API (Express + Mongoose)| Cloudflare Workers  | https://artesanosonline-api.jaimedanielmontana.workers.dev |

Antes estaba todo en Render (`*.onrender.com`), que ya no se usa.

## Desarrollo

```bash
pnpm install                 # instala los tres paquetes
cp backend/.dev.vars.example backend/.dev.vars   # y rellena las credenciales

pnpm dev:backend             # Worker en http://localhost:8787
pnpm dev:frontend            # tienda en http://localhost:5173
pnpm dev:admin               # panel en http://localhost:5174
```

Sin `VITE_API_URL`, el frontend y el admin apuntan a `http://localhost:8787`.

```bash
pnpm build                   # compila frontend y admin
pnpm lint                    # eslint en los tres paquetes
pnpm seed                    # siembra las 8 categorías en Mongo + Cloudinary
```

## El backend corre en Workers, y eso impone cosas

workerd no es Node. Lo que cambia respecto a un Express normal:

- **Una conexión a Mongo por request.** No se puede compartir un socket entre
  requests: el monitor de topología del driver pertenece al contexto de I/O del
  request que abrió la conexión, así que en cuanto ése termina, los que la
  siguen usando se cuelgan. `worker.js` abre y cierra la conexión dentro del
  handler, y los modelos la resuelven vía `AsyncLocalStorage`
  (`src/db/requestScopedModel.js`), de modo que los controladores siguen
  escribiendo `foodModel.find(...)` sin enterarse.
- **Las rutas se importan dentro del primer request**, no en el scope global:
  `bson` genera bytes aleatorios en un static initializer y workerd prohíbe la
  aleatoriedad y la I/O fuera de un contexto de request.
- **`bcryptjs`, no `bcrypt`.** workerd no implementa N-API y no puede cargar
  addons nativos de C++. Los hashes `$2b$` son compatibles en ambos sentidos.
- **No hay disco, así que no hay `multer`.** Las imágenes van a Cloudinary: el
  admin las redimensiona, las manda como data URI dentro del JSON y el backend
  las sube por REST firmando con WebCrypto. En Mongo se guarda la URL absoluta.

## Configuración

En local, `backend/.dev.vars` (está en `.gitignore`). En producción, secretos
del Worker:

```bash
cd backend
pnpm exec wrangler secret put MONGO_URI
pnpm exec wrangler secret put JWT_SECRET
pnpm exec wrangler secret put CLOUDINARY_CLOUD_NAME
pnpm exec wrangler secret put CLOUDINARY_API_KEY
pnpm exec wrangler secret put CLOUDINARY_API_SECRET
```

`CLOUDINARY_FOLDER` no es secreto y va en `wrangler.jsonc`.

En Vercel, ambos proyectos necesitan `VITE_API_URL` apuntando al Worker, y
`ENABLE_EXPERIMENTAL_COREPACK=1` para que use pnpm 11 (la tabla de versiones
soportadas de Vercel llega hasta la 10).

**MongoDB Atlas**: el Worker sale por las IPs de Cloudflare, que no son fijas.
Si Network Access no incluye `0.0.0.0/0`, toda ruta que toque la base de datos
responde 500 tras 10 s (`MongooseServerSelectionError`). El acceso lo protegen
las credenciales de la cadena de conexión, no la lista de IPs.

## Estado de Stripe

Desactivado desde el commit `73c79a2`. `POST /api/order/place` y
`POST /api/order/verify` responden 503, y el checkout sólo ofrece contra
entrega. Para reactivarlo hace falta implementar la integración con el cliente
HTTP de `fetch` (el SDK de Node de Stripe usa `http` y streams, que no van en
Workers) y poner `STRIPE_SECRET_KEY` como secreto.

## Sin autenticación en el panel

`POST /api/food/add`, `/api/food/remove`, `/api/order/list` y
`/api/order/status` no piden credenciales, igual que antes de la migración.
`/api/order/list` devuelve nombre, dirección y teléfono de todos los clientes a
quien pregunte. Si el panel va a seguir en una URL pública, esto necesita un
login.
