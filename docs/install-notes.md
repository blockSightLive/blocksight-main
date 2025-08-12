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
npm --workspace backend install -D @types/cors @types/express @types/jest @types/node @types/supertest @types/ws eslint eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser jest prettier supertest ts-jest ts-node tsconfig-paths typescript
```

Post-install (backend):
- Remove `backend/src/types/dev-shims.d.ts`
- Remove `// @ts-nocheck` from `backend/src/server.ts`
- Tighten ESLint root overrides to use `parserOptions.project` for backend
- Run: `npm run typecheck -w backend && npm run lint -w backend && npm run build -w backend && npm test -w backend`

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
