# ArtesanosOnline — Artisan marketplace

Storefront for Artesanía Rocianera, live at **[artesanosonline-frontend.vercel.app](https://artesanosonline-frontend.vercel.app)**.

A pnpm workspace with three packages that deploy to two platforms: `frontend` and `admin` are React SPAs built with Vite and served from Vercel, and `backend` is an Express 5 app over MongoDB Atlas running on Cloudflare Workers at [artesanosonline-api.jaimedanielmontana.workers.dev](https://artesanosonline-api.jaimedanielmontana.workers.dev). Routes are mounted under `/api` — `/api/user`, `/api/food`, `/api/cart`, `/api/order`, `/api/menu`. The management panel lives at [artesanosonline-admin.vercel.app](https://artesanosonline-admin.vercel.app).

Express runs on workerd through `httpServerHandler` from `cloudflare:node`, but the runtime is not Node, and four decisions in this repo only make sense in that light — see [Runtime notes](#runtime-notes).

## Tech Stack

<!-- tech-stack:start -->
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-deployed-F38020?logo=cloudflare&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-8.3-CA4245?logo=reactrouter&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_9.9-47A248?logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-REST-3448C5?logo=cloudinary&logoColor=white)
![Wrangler](https://img.shields.io/badge/Wrangler-4.123-F38020?logo=cloudflare&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0-000000?logo=jsonwebtokens&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10.8-4B32C3?logo=eslint&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11.21-F69220?logo=pnpm&logoColor=white)
<!-- tech-stack:end -->

## Getting Started

Requires Node >= 22. This project uses **pnpm only** (pinned via the `packageManager` field — corepack picks it up automatically):

```bash
pnpm install       # installs all three packages
pnpm dev:backend   # Worker on http://localhost:8787
pnpm dev:frontend  # storefront on http://localhost:5173
pnpm dev:admin     # panel on http://localhost:5174
```

`pnpm dev:backend` starts `wrangler dev`, which runs the real workerd runtime locally, not a Node server — so anything that breaks in production breaks here too. With no `VITE_API_URL` set, the two SPAs fall back to `http://localhost:8787`.

Local backend secrets go in `backend/.dev.vars` (git-ignored, see `.dev.vars.example`):

```
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Other scripts:

```bash
pnpm build   # builds frontend and admin with Vite
pnpm lint    # eslint across the workspace
pnpm seed    # seeds the 8 catalogue categories into Mongo + Cloudinary
```

There is no `build` script for the backend: wrangler bundles the Worker itself. To check that the bundle still builds without shipping it, run `pnpm --filter backend exec wrangler deploy --dry-run`. There is no test suite.

## Runtime notes

workerd is not Node, and four things in this repo follow from that:

1. **Routes are imported inside the first request**, not at module scope. `bson` generates random bytes in a static initializer, and Workers forbids randomness and I/O outside a request context.

2. **Every request opens and closes its own MongoDB connection.** A connection does not survive between requests, and it cannot be shared between concurrent ones either: the driver's topology monitor belongs to the I/O context of whoever opened it, so once that request ends the others hang. Opening and closing must both happen inside the handler — closing after the response has been sent leaves the close pending forever.

3. **Models resolve against the current request's connection** through an `AsyncLocalStorage` (`backend/src/db/requestScopedModel.js`), so the controllers stay untouched and keep writing `foodModel.find(...)`. Express talks to the Worker over a socket, so that context does not propagate on its own: the connection id travels in an internal header and a middleware re-enters the context before any route runs.

4. **There is no filesystem, so there is no `multer`.** Product images go to Cloudinary: the admin panel resizes the file in a canvas, sends it as a base64 data URI inside the JSON body, and the backend uploads it over Cloudinary's REST API with a WebCrypto signature. Mongo stores the absolute URL, not a filename.

Beyond that, `bcryptjs` replaces `bcrypt` (workerd loads no native addons, though existing `$2b$` hashes stay valid).

## Payments

Stripe has been disabled since commit `73c79a2`. `POST /api/order/place` and `POST /api/order/verify` return 503, and the checkout only offers cash on delivery. Re-enabling it means implementing the integration against the `fetch` HTTP client — Stripe's Node SDK uses `http` and streams, neither of which works on workerd — and setting `STRIPE_SECRET_KEY` as a Worker secret.

## Known gap: the admin panel has no authentication

`POST /api/food/add`, `POST /api/food/remove`, `GET /api/order/list` and `POST /api/order/status` take no credentials, as was already the case before the move off Render. `GET /api/order/list` returns the name, address and phone number of every customer to anyone who asks. Now that the panel sits on a public URL, this needs a login.

## Dependency updates

A scheduled cloud routine runs daily: it updates dependencies within their semver ranges (`pnpm update -r` + `pnpm self-update`), verifies `pnpm lint`, the Vite builds and the Worker bundle via `wrangler deploy --dry-run`, refreshes the tech-stack table above, and opens a pull request for review. Supply-chain guardrails in `pnpm-workspace.yaml` (trust policy, minimum release age, `allowBuilds` for esbuild and workerd, and the `eslint-plugin-react>eslint` peer allowance) are never overridden — packages that fail trust checks stay held at their last trusted version.

## Deploy

Pushes to `main` deploy all three packages to production: `frontend` and `admin` via [Vercel](https://vercel.com), `backend` via [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) with root directory `backend`. Production secrets are managed with `pnpm exec wrangler secret put NAME` and never live in the repository.

Two settings that are easy to lose and break production:

- Both Vercel projects need `VITE_API_URL` pointing at the Worker, and `ENABLE_EXPERIMENTAL_COREPACK=1` — Vercel's supported-versions table stops at pnpm 10 and this repo is on 11.
- MongoDB Atlas Network Access must include `0.0.0.0/0`. Workers egress from Cloudflare's IPs, which are not fixed; without it every route that touches the database returns 500 after a 10-second server-selection timeout. Access is guarded by the connection-string credentials, not by the IP list.
