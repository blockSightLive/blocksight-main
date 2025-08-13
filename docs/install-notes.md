# Install Notes (Do Not Run Automatically)

Follow these steps after initial commit/push.

## Prereqs
- Node >= 20, npm >= 9
- From repo root

## Backend (Express + ws)

Add dependencies (runtime + dev):

```bash
# Runtime deps
npm --workspace backend install cors dotenv electrum-client express express-rate-limit helmet ioredis pino ws zod

# Dev deps
npm --workspace backend install -D @types/cors @types/express @types/jest @types/node @types/supertest @types/ws eslint @eslint/js @eslint/eslintrc eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser jest ts-jest prettier supertest ts-node tsconfig-paths typescript
```

Post-install (backend):
- Remove `backend/src/types/dev-shims.d.ts`
- Remove `// @ts-nocheck` from `backend/src/server.ts`
- Tighten ESLint root overrides to use `parserOptions.project` for backend
- Run: `npm run typecheck -w backend && npm run lint -w backend && npm run build -w backend && npm test -w backend`
 - ESLint: backend uses flat config at `backend/eslint.config.mjs`

### ESLint strict project references (paste into .eslintrc.json)

Replace the current `overrides` section with this:

```json
{
  "overrides": [
    {
      "files": ["backend/**/*.ts"],
      "parserOptions": { "project": ["./backend/tsconfig.json"], "tsconfigRootDir": "__dirname" },
      "env": { "node": true }
    },
    {
      "files": ["frontend/**/*.ts", "frontend/**/*.tsx"],
      "parserOptions": { "project": ["./frontend/tsconfig.json"], "tsconfigRootDir": "__dirname", "ecmaFeatures": { "jsx": true } },
      "env": { "browser": true }
    }
  ]
}
```

## Frontend (Vite + React + TS + i18n)

Add dependencies:

```bash
# Runtime deps
npm --workspace frontend install react react-dom i18next react-i18next

# Dev deps
npm --workspace frontend install -D @types/react @types/react-dom @vitejs/plugin-react eslint eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser jest prettier typescript vite
```

Post-install (frontend):
- Run: `npm run typecheck -w frontend && npm run lint -w frontend && npm run build -w frontend && npm test -w frontend`
- Add Vite config (`vite.config.ts`) and minimal `index.html`/entry files in a later step

### Frontend Vite scaffolding (later step)
- Create `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/App.tsx`, and `frontend/vite.config.ts`
- Update Dockerfile to COPY and build the frontend, and add frontend service to compose files

## Optional: Root scripts
- Run both workspace installs in one go later:

```bash
npm install -w backend -w frontend
```

## Redis (optional)
- Local dev service: `npm run services:redis:start`

## Notes
- Do not commit real secrets; use `.env.example` to document new variables
- After installs, update ESLint overrides to use strict project references per the handbook

## Containers First (recommended dev flow)
- Build unified image: `docker build -t blocksight/app:dev .`
- Dev stack (backend + Redis): `docker compose -f docker-compose.dev.yml up -d --build`
- Full stack (when frontend/electrs are wired): `docker compose -f docker-compose.stack.yml up -d --build`
- Inside compose, use service DNS (e.g., `redis`, `backend`) for URLs; from host use mapped ports (`http://localhost:8000`)
