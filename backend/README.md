# TrustFun Backend

Express + TypeScript API backed by Postgres via Prisma. Frontend calls it
through `frontend/src/services/tokenService.ts`.

## Local setup

1. Start Postgres (native install or Docker — the app doesn't care):
   ```bash
   sudo pg_ctlcluster 16 main start   # or: docker compose up -d postgres
   ```
2. Create a dev DB/role matching `.env.example`'s `DATABASE_URL`, or edit it to match your own:
   ```bash
   sudo -u postgres psql -c "CREATE ROLE trustfun WITH LOGIN PASSWORD 'trustfun_dev' CREATEDB;"
   sudo -u postgres createdb -O trustfun trustfun_dev
   ```
3. From the repo root (this is an npm workspace):
   ```bash
   npm install
   cp backend/.env.example backend/.env   # edit if you changed the role/db name above
   cd backend
   npx prisma migrate dev    # creates tables
   npx prisma db seed        # loads the 3 fixture tokens
   npm run dev                # http://localhost:3001
   ```
4. In another terminal, run the frontend (`npm run dev -w frontend`, or from
   repo root `npm run dev` to run both concurrently). It talks to this API
   through Vite's dev proxy (`/api/*` → `localhost:3001`, prefix stripped) —
   no CORS config needed for that path. Setting `VITE_API_URL` in
   `frontend/.env` instead calls this server's origin directly and does
   need `CORS_ORIGIN` here to match.

## Notes

- `prisma studio` (`npm run prisma:studio`) gives a DB GUI if you want to
  inspect rows directly.
- `npm run build` type-checks then bundles to `dist/index.js` via esbuild
  (`node dist/index.js` to run it). Prisma Client stays external to the
  bundle on purpose — it needs to resolve its generated query engine
  relative to `node_modules`.
- No request auth exists yet. Creator wallet identity is whatever the
  client sends — fine for local dev, not for anything public-facing.
