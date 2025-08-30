# Dockerized Development

## Current Development Setup

### Build and Run Backend + Redis
```bash
# Build the backend image
docker build -t blocksight-backend:dev .

# Start development services (backend + Redis only)
docker-compose -f docker-compose.dev.yml up -d --build
```

**Services Available:**
- Backend: http://localhost:8000
- Redis: localhost:6379 (internal: redis:6379)

## Future Implementations

### Full Stack with electrs (Not Yet Implemented)
```bash
# Future: Complete stack with electrs, Bitcoin Core, etc.
docker-compose -f docker-compose.stack.yml up -d --build
```

## Development Notes

- **Frontend**: Runs locally for fast development iteration
- **Backend**: Containerized with Redis for consistency
- **Multi-stage Dockerfile**: Ready for future frontend integration
- **Host Access**: Use `host.docker.internal` to access host services from containers
- **Environment**: Override via `.env` file or `environment:` in services
- **Networking**: Prefer service DNS names (e.g., `http://backend:8000`) within compose network
