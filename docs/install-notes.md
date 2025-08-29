# Install Notes (Do Not Run Automatically)

/**
 * @fileoverview Installation and setup notes for BlockSight.live development
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-29
 * @lastModified 2025-08-29
 * 
 * @description
 * This document provides installation notes and setup instructions for developers.
 * Note that the frontend is already fully implemented and deployed.
 * 
 * @dependencies
 * - 00-model-spec.md (system overview)
 * - 01-development-roadmap.md (development strategy)
 * - docs/developer-handbook.md (development guidance)
 * 
 * @state
 * ✅ CURRENT - Updated to reflect current system state and consolidated installation info
 * 
 * @todo
 * - Monitor for new dependencies or configuration changes
 * - Keep installation steps current with system changes
 */

Follow these steps after initial commit/push.

## Prereqs
- Node >= 20, npm >= 9
- From repo root

## Backend (Express + ws) - PARTIALLY IMPLEMENTED ✅

**Current Status**: CoreRpcAdapter implemented, Express server partially implemented, WebSocket hub operational

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

## Frontend (Vite + React + TS + i18n) - FULLY IMPLEMENTED ✅

**Current Status**: Complete React application deployed to Vercel staging, all features operational

**Note**: Frontend is production-ready and deployed. Dependencies are already installed and configured.

Add dependencies (if needed for development):

```bash
# Runtime deps
npm --workspace frontend install react react-dom i18next react-i18next styled-components@^6.1.0 @types/styled-components@^5.1.34

# Dev deps
npm --workspace frontend install -D @types/react @types/react-dom @vitejs/plugin-react eslint eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser jest prettier typescript vite
```

### Styled Components Setup ✅

**Purpose**: Enables cosmic background and advanced theming system

**Installation**: The styled-components dependency is already included in the runtime deps above.

**What This Enables**:
- Cosmic background system with animated starfield
- Dynamic theme switching (dark = cosmic background, light = no background)
- Advanced component styling with theme integration
- BackgroundSystem component rendering behind all content

**Verification**: After installation, you should see:
- Deep space gradient background in dark theme
- Animated starfield with stars and nebulae
- Proper layering behind content
- Smooth theme switching between light and dark modes

**Troubleshooting**: If the background doesn't appear:
1. Check browser console for errors
2. Verify styled-components is installed: `npm list styled-components`
3. Ensure BackgroundSystem component is imported in App.tsx
4. Check that dark theme is active (cosmic background only shows in dark mode)

Post-install (frontend):
- Run: `npm run typecheck -w frontend && npm run lint -w frontend && npm run build -w frontend && npm test -w frontend`
- Add Vite config (`vite.config.ts`) and minimal `index.html`/entry files in a later step

### Frontend Vite scaffolding (later step)
- Create `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/App.tsx`, and `frontend/vite.config.ts`
- Update Dockerfile to COPY and build the frontend, and add frontend service to compose files

## Current Package Scripts (Already Configured)

**Root Scripts Available:**
```bash
npm run dev          # Start both backend and frontend development servers
npm run build        # Build both backend and frontend
npm run typecheck    # Type check both workspaces
npm run lint         # Lint both workspaces
npm run test         # Run tests for both workspaces
npm run services:redis:start  # Start Redis service
npm run services:redis:stop   # Stop Redis service
```

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

## Electrs on VM (WSL2 or Linux) – Runbook

Prereqs (VM)
- Bitcoin Core (bitcoind) synced or syncing
- External SSD/NVMe mounted (recommended)
- Packages: `clang cmake build-essential git cargo`

Install/build electrs (on the VM)
```bash
git clone https://github.com/romanz/electrs.git
cd electrs
cargo build --locked --release
```

Config (create `~/.electrs/config.toml`)
```toml
cookie_file = "/path/to/bitcoin/.cookie"         # e.g., /mnt/b/bitcoin-data/.cookie
daemon_rpc_addr = "127.0.0.1:8332"
daemon_p2p_addr = "127.0.0.1:8333"
network = "bitcoin"
electrum_rpc_addr = "0.0.0.0:50001"               # reachable by host/container

# Throttle for stability during initial indexing
db_parallelism = 1
ignore_mempool = true
wait_duration = "15s"
jsonrpc_timeout = "30s"

# Place index on fast external disk
# db_dir = "/mnt/b/electrs-db"
```

Run (throttled)
```bash
nice -n 10 ionice -c2 -n7 ./target/release/electrs --conf ~/.electrs/config.toml
```

Backend connectivity (compose on Windows host)
- Option A (direct VM IP): set `ELECTRUM_HOST=<VM_IP>` (e.g., `172.x.x.x`)
- Option B (port-proxy → `host.docker.internal`):
  - Admin PowerShell:
    - `netsh interface portproxy add v4tov4 listenaddress=127.0.0.1 listenport=50001 connectaddress=<VM_IP> connectport=50001`
    - `netsh advfirewall firewall add rule name="Electrs 50001 inbound" dir=in action=allow protocol=TCP localport=50001`
  - Compose: `ELECTRUM_HOST=host.docker.internal`, `ELECTRUM_PORT=50001`, `ELECTRUM_TLS=false`

WSL2 resource limits (Windows host)
- Create `%UserProfile%/.wslconfig` and set for stability:
```ini
[wsl2]
memory=12GB
processors=8
swap=16GB
localhostForwarding=true
```
- Apply with: `wsl --shutdown` (PowerShell), then restart your distro.

### Troubleshooting electrs stability on WSL2 (heavy indexing)

Symptoms
- WSL distro exits unexpectedly during heavy ranges; indexing restarts.

Likely causes
- NTFS I/O bottlenecks and USB power saving on external drives
- Memory pressure (WSL OOM) or file descriptor limits
- Slow Core RPC during initial sync causing timeouts/retries

Mitigations (apply in order)
1) Use ext4 for the electrs DB
   - Prefer a path inside the WSL ext4 filesystem (e.g., `~/.electrs/db`) rather than `/mnt/<drive>`.
   - Or reformat/mount an external disk as ext4 via `wsl --mount` and point `db_dir` there.
   - Use an absolute `db_dir` in config to avoid accidental resets.
2) Increase file descriptor limit before launching electrs
   ```bash
   ulimit -n 8192
   ```
3) Keep throttling and timeouts conservative
   - `db_parallelism = 1`
   - `ignore_mempool = true` (until fully synced)
   - `jsonrpc_timeout = "60s"`
   - If supported by your electrs version: `index_batch_size = 500`–`1000`
   - `reindex_last_blocks = 1000`
4) Power/USB stability on Windows host
   - Disable “USB selective suspend” and device power saving.
   - Set Windows Power Plan to High performance; prevent external drive sleep.
   - Exclude the electrs DB directory from antivirus scanning.
5) Controlled “pause” to let system breathe and ensure checkpoints
   - Use `timeout` to send SIGINT after N seconds so electrs flushes state and exits cleanly, then restart later:
     ```bash
     ulimit -n 8192 && nice -n 10 ionice -c2 -n7 timeout --signal=INT 1500 \
       ./target/release/electrs --conf ~/.electrs/config.toml
     ```

Resumability
- electrs persists index progress in RocksDB; on restart it resumes from the last indexed height.
- If it always restarts from block 1, verify `db_dir` is stable, absolute, and not on a volatile mount; check logs for corruption and consider `auto_reindex = true` with `reindex_last_blocks` set.

Diagnostics
```bash
# In the VM
dmesg -T | tail -n 200 | grep -i -E 'oom|killed|out of memory'
grep -i electrs /var/log/syslog 2>/dev/null | tail -n 200
ulimit -n
vmstat 1
iotop -oPa   # may require sudo; shows per-process I/O pressure
```

