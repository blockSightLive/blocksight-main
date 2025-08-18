# BlockSight.live – Execution Checklists (Guided by Legend Gates)

/**
 * @fileoverview Phase-by-phase execution checklists with mandatory gates from the legend
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 *
 * @description
 * This document operationalizes the roadmap. Each task embeds Legend gates as process checks
 * with Definition of Ready (DoR), required Artifacts, and Definition of Done (DoD).
 * It ensures consistent, high-quality engineering output (see docs/code-standard.md).
 *
 * @dependencies
 * - 01-development-roadmap.md (strategy and architecture)
 * - 02-technical-implementation.md (implementation details)
 * - README.md (commands and operations)
 */

---

## Using This Document

- Every checklist item must satisfy gates: $, #, @, *, &, %, 🚀, 🔒, 📊, 🔄 as applicable.
- For each item, verify DoR → produce Artifacts → meet DoD before moving on.
- Keep PRs small and focused; one logical change per PR; link issues.

---

## Phase 0: Foundation (Weeks 1-2)

### Infrastructure Foundation (COMPLETED - 2025-08-18)
- [x] Bitcoin Core VM Setup **@ 🔒** ✅ **COMPLETED**
  - VirtualBox Ubuntu LTS VM (192.168.1.67) - 100% sync, 774GB external storage

- [x] Electrs Integration **@ 📊** ✅ **COMPLETED**
  - electrs 0.10.10 on Windows host, connected to Bitcoin Core VM

- [x] Docker Environment **🚀** ✅ **COMPLETED**
  - Backend (8000) + Redis (6379) containers running

- [x] Network Validation **@ 📊** ✅ **COMPLETED**
  - All connectivity tests passing: Windows→VM, Electrs→Core, Docker→Electrs

### Backend Development Foundation (COMPLETED - 2025-08-18)
- [x] Express Application Structure **🚀** ✅ **COMPLETED**
  - Complete Express app with adapters, controllers, routes

- [x] Electrum Adapter Architecture **@ #** ✅ **COMPLETED**
  - Real/fake adapters with `ping()` and `getFeeEstimates()` methods

- [x] HTTP API Endpoints **#** ✅ **COMPLETED**
  - `/v1/health` and `/v1/fee/estimates` endpoints with tests

- [x] Development Tooling **🚀** ✅ **COMPLETED**
  - TypeScript, ESLint, Prettier, Jest configured with npm scripts

### Electrum Integration Validation (COMPLETED - 2025-08-18)
- [x] Real Electrum Adapter Testing **@ # 📊** ✅ **COMPLETED**
  - Live electrs connection with Electrum v1.4 protocol, sub-200ms response

- [x] Protocol Compatibility **@ #** ✅ **COMPLETED**
  - Electrum v1.4 compatibility with `server.version` and `blockchain.estimatefee`

### DevOps Infrastructure Setup
- [ ] Repo hygiene and protections **$ 🚀 🔒**
  - DoR: Branch strategy approved; CODEOWNERS set; PR template with legend gates
  - Artifacts: branch protections; CODEOWNERS; PR template; commitlint config
  - DoD: Protected `main`; required reviews; status checks enforced
- [x] CI fast path (<2m build) **🚀 #**
  - DoR: Cache strategy decided; node/rust matrix defined
  - Artifacts: CI workflows (build, test, lint, typecheck)

## Phase 0.5: Version Current Working State (Immediate)

### Version Control & Tagging **$ 🚀**
- [ ] Tag Current MVP Foundation **$ 🚀**
  - DoR: All current changes committed, working state validated
  - Artifacts: Git tag `v1.0.0-mvp-foundation`
  - DoD: Tag created, working state preserved for rollback

- [ ] Merge to Main Branch **$ 🚀**
  - DoR: Current working state validated, tests passing
  - Artifacts: Merged `initialization` branch to `main`
  - DoD: Main branch contains working MVP foundation

---

## Phase 1: MVP Frontend Development (Weeks 3-4)

### Frontend Foundation **🚀 #**
- [ ] React Application Setup **🚀**
  - DoR: Vite configuration, TypeScript setup, basic routing
  - Artifacts: React app with TypeScript, basic component structure
  - DoD: App builds and runs, basic routing works

- [ ] Bitcoin Data Display Components **# 📊**
  - DoR: Design mockups for block/transaction/address views
  - Artifacts: React components for Bitcoin data display
  - DoD: Components render real data from backend API

- [ ] Real-time Data Integration **@ 📊**
  - DoR: WebSocket or polling strategy for live updates
  - Artifacts: Real-time Bitcoin data display
  - DoD: Frontend shows live blockchain updates

### API Expansion **@ #**
- [ ] Additional Electrum Endpoints **@ #**
  - DoR: Identify next priority endpoints (block headers, tx details)
  - Artifacts: New backend routes and frontend integration
  - DoD: New endpoints tested and working

- [ ] Error Handling & Resilience **@ 📊**
  - DoR: Error scenarios identified (network, electrs down)
  - Artifacts: Comprehensive error handling in frontend
  - DoD: Graceful degradation when services unavailable
  - DoD: Green CI; build < 2 minutes; flaky tests <1%
- [ ] Security baseline **🔒 🚀**
  - DoR: SAST/DAST tools chosen; SBOM plan
  - Artifacts: Dependency scanning; secrets scanning; license checks
  - DoD: Zero criticals; secrets blocked in CI; SBOM generated
- [ ] Observability scaffolding **📊 🚀**
  - DoR: Metrics/alerts list; SLOs
  - Artifacts: Prometheus/Grafana/Alertmanager configs; tracing bootstrap
  - DoD: Dashboards live; actionable alerts only

### electrs Submodule Management
- [ ] Submodule add and pin strategy **$ 🔒**
  - DoR: Submodule commit pin policy; update cadence
  - Artifacts: .gitmodules; docs in README
  - DoD: Submodule initialized; pinned to known-good commit
- [ ] Build/health pipelines **🚀 # 📊**
  - DoR: Targets and hardware profiles
  - Artifacts: Build scripts; health probes
  - DoD: Build succeeds in CI; healthcheck endpoint monitored

### Bitcoin Development Infrastructure
- [ ] Core node configs (testnet/mainnet) **@ 🔒**
  - DoR: Config policy; storage and dbcache planning
  - Artifacts: Config templates; runbooks
  - DoD: Nodes synced; RPC responsive; access controlled

### Single-Machine Dev Topology (Windows host + Linux VM)
- [x] VM provisioning and hardening **@ 🔒** ✅ **COMPLETED**
  - VirtualBox Ubuntu LTS VM (192.168.1.67) with shared folder access
- [x] electrs ↔ Core connectivity **@ 📊** ✅ **COMPLETED**
  - electrs running on Windows, connecting to Bitcoin Core VM via 192.168.1.67:8332
- [x] Runbook & recovery **& 📊** ✅ **COMPLETED**
  - Complete setup documentation in `docs/bitcoin-core-virtualbox-setup.md` and `docs/electrs-windows-setup.md`

### Dev Services
- [ ] Redis (Docker) **$ 🚀**
  - DoR: Port 6379 availability; developer opt-in acknowledged
  - Artifacts: Root npm scripts to start/stop a local Redis container; `REDIS_URL` documented
  - DoD: Local cache reachable when enabled; app degrades gracefully if disabled

### Containerized Dev Stack
- [x] Unified image build **$ 🚀** ✅ **COMPLETED**
  - Docker build successful, image created successfully
- [x] Compose orchestration **$ 🚀** ✅ **COMPLETED**
  - Docker compose working, services starting successfully

---

## Phase 1: Core Bitcoin Modules (Weeks 3-6)

### electrs-integration
- [x] Electrum adapter interface + fake implementation (CI-friendly) **# 🚀** ✅ **COMPLETED**
  - Adapter interface, fake adapter, routes, controller, tests
- [x] Real Electrum adapter (env switch ELECTRUM_ENABLED) **$ # @** ✅ **COMPLETED**
  - RealElectrumAdapter with electrum-client, environment-driven switching
- [x] Electrum adapter testing and validation **# @ 📊** ✅ **COMPLETED**
  - Integration tests with real electrs, P95 <200ms to electrs
- [ ] Reorg detection and rollback **# @ ***
  - DoR: Reorg scenarios; test vectors
  - Artifacts: Orphan handling logic; integration tests
  - DoD: Safe rollback to checkpoint; no inconsistent caches

### cache-management
- [ ] Confirmation-aware TTL **# @ * 📊**
  - DoR: TTL table; invalidation triggers
  - Artifacts: Cache policies; metrics
  - DoD: Hit rates meet targets; stale reads <0.1%

### websocket-events
- [ ] Event pipeline with 1–2s end-to-end latency **# @ * 📊**
  - DoR: Topics and QoS; backpressure plan
  - Artifacts: Event schemas; load tests
  - DoD: P95 latency ≤2s; zero dupes across reconnects

### CDN Widgets (Scaffolding)
- [ ] Embed API contract draft **$ &**
  - DoR: Widget list (timeline, fee gauge, load)
  - Artifacts: Contracts, sample embeds
  - DoD: Contract tests pass in CI

### bitcoin-validation
- [ ] Full script-type coverage **# @ 🔒**
  - DoR: Cases enumerated; vectors ready
  - Artifacts: Parser/validator; test suite
  - DoD: 100% pass vs Core; fuzz tests green

---

## Phase 2: Application Modules (Weeks 7-12)

### api-gateway
- [ ] OpenAPI-first endpoints with rate limiting **$ # 🔒**
  - DoR: OpenAPI drafts; RL policy
  - Artifacts: OpenAPI; tests; RL config
  - DoD: Contract tests pass; 429 behavior correct

### search-indexing
- [ ] Address/tx search with caching **# @ * 📊**
  - DoR: Index plan; query KPIs
  - Artifacts: Index DDL; explain plans; tests
  - DoD: P95 <150ms cached; <600ms uncached

### analytics-computation
- [ ] Fee percentiles and network gauges **# @ * 📊**
  - DoR: Formulae; windows
  - Artifacts: Jobs; tests; dashboards
  - DoD: Accuracy within ±1% of baseline

### Server-side Procedures (SQL & Redis)
- [ ] PostgreSQL analytics functions/views **# * 📊**
  - DoR: Data model and compute hot spots identified; view vs function decided
  - Artifacts: Versioned migrations (analytics.fn_*, mv_*); tests; explain plans
  - DoD: Functions/views pass tests; perf budgets respected
- [ ] Redis atomic cache functions **# * 📊**
  - DoR: Hot cache paths identified; need for atomicity established
  - Artifacts: Versioned Redis functions (function:<name>:v1); loader with SHA validation; tests
  - DoD: Functions executed within time budget; fallbacks verified

### CDN Widgets (Public Embeds)
- [ ] Edge caching and budgets **# * 📊**
  - DoR: TTLs, refresh budgets, themes
  - Artifacts: CDN config, docs
  - DoD: P95 <200ms bootstrap; refresh within budget

### price-integration
- [ ] Multi-source feeds with failover **# * 🔒**
  - DoR: Source SLA; fallback policy
  - Artifacts: Adapters; tests
  - DoD: Zero downtime on single-source failure

---

## Phase 3: Test & QA (Weeks 13-15)

- [ ] 4-tier testing battery **# @ * 🚀**
  - DoR: Suites planned; data volume
  - Artifacts: CI jobs; reports
  - DoD: All green; coverage thresholds met
- [ ] Perf targets validated **# * 📊**
  - DoR: Targets locked; datasets
  - Artifacts: Benchmarks; traces
  - DoD: All SLIs within budgets
 - [ ] Container images validated **# * 📊**
   - DoR: Docker images and compose files finalized
   - Artifacts: Container smoke tests; startup time within budget
   - DoD: Green runs in CI with container builds

---

## Phase 4: Launch (Week 16)

- [ ] Release & rollback rehearsal **% 🚀 🔒**
  - DoR: Runbooks; flags
  - Artifacts: Release notes; smoke tests
  - DoD: Canary green; rollback verified
- [ ] SLOs enforced in prod **📊 🔄**
  - DoR: Error budgets; paging policy
  - Artifacts: Dashboards; alerts
  - DoD: On-call ready; noisy alerts fixed

### BlockInsight Limited Release (Post‑MVP)
- [ ] Billing + subscriptions behind flags **$ 🔒 %**
  - DoR: Sandbox provider, plan matrix
  - Artifacts: Billing config, API keys, usage meters
  - DoD: Test cohort onboarded; rollback tested

---

## PR & Commit Standards (applies to all phases)

- Conventional commits; one logical change per PR; link issues.
- Mandatory checklist in PR: $, #, @, *, &, %, 🚀, 🔒, 📊, 🔄 as applicable.
- Do not merge red builds; no skipped gates.
- Update `README.md` when commands/processes change.

---

## Quality Bars (from docs/code-standard.md)

- Unit coverage critical paths ≥95%; integration ≥85%.
- No unused code; no TODOs without dates; error handling mandatory.
- Performance budgets respected; regressions blocked at PR.



---

## Cross-Cutting: Internationalization (i18n)

### Phase 1 (Foundation)
- [ ] i18next scaffolding with `en`, `es`, `he`, `pt` **$ &**
  - DoR: Translation key strategy; file structure agreed
  - Artifacts: `frontend/src/i18n/locales/*/translation.json`; language toggle UI; RTL direction switch
  - DoD: No hardcoded UI text in MVP screens; default `en` fallback

### Phase 2 (Hardening)
- [ ] Complete key coverage and RTL audits **# &**
  - DoR: Missing-key report; RTL layout checklist
  - Artifacts: Filled translations; RTL fixes for complex views
  - DoD: Zero missing keys; RTL parity acceptance

### Phase 3 (QA)
- [ ] Locale testing and bundle checks **# * 📊**
  - DoR: Locale test matrix; perf budgets
  - Artifacts: Snapshot tests for `en`/`es`/`he`/`pt`; visual regression; code-split locales
  - DoD: Tests green; bundle budgets respected
