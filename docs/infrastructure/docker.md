# Dockerized Development

## Build single image (backend + frontend artifacts)
```bash
docker build -t blocksight/app:dev .
```

## Run dev stack (Redis + backend)
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

- Backend: http://localhost:8000
- Redis: localhost:6379 (internal: redis:6379)

## Run full stack (multi-container)
```bash
docker compose -f docker-compose.stack.yml up -d --build
```

## Notes
- The Dockerfile is multi-stage. Frontend build will be wired once Vite config and entry are added.
- Use `host.docker.internal` to access host services (e.g., electrs) from containers on macOS/Windows. On Linux, map the host IP explicitly.
- Environment variables can be overridden via an `.env` file passed to compose or via `environment:` in services.
 - For a container-to-container URL, prefer service DNS names (e.g., `http://backend:8000` inside the compose network).
