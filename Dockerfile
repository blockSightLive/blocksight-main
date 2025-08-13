# Multi-stage Dockerfile building backend and frontend into a single image

FROM node:20-alpine AS backend-build
WORKDIR /work/backend
# Ensure backend tsconfig's `extends: "../tsconfig.json"` can be resolved during build
COPY tsconfig.json /work/tsconfig.json
COPY backend/package.json backend/tsconfig.json ./
RUN npm install --omit=optional
COPY backend/src ./src
RUN npx tsc -p tsconfig.json

FROM node:20-alpine AS frontend-build
WORKDIR /work/frontend
COPY frontend/package.json frontend/tsconfig.json ./
RUN npm install --omit=optional
# Vite config will be added later; building will be wired once present
# COPY frontend/index.html frontend/vite.config.ts frontend/src ./
# RUN npx vite build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# optional static server for frontend previews
RUN npm install -g serve@14

# Backend artifacts (code + runtime deps)
COPY --from=backend-build /work/backend/dist ./backend/dist
COPY --from=backend-build /work/backend/node_modules ./backend/node_modules
COPY --from=backend-build /work/backend/package.json ./backend/package.json

# Frontend artifact (placeholder until build is wired)
# COPY --from=frontend-build /work/frontend/dist ./frontend/dist

EXPOSE 8000 3000
# This image is used by docker-compose to run backend and frontend with different commands
CMD ["node", "backend/dist/server.js"]


