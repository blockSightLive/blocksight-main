# BlockSight.live – Execution Checklists (Guided by Legend Gates)

/**
 * @fileoverview Phase-by-phase execution checklists with mandatory gates from the legend
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
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
 * - THREEJS_IMPLEMENTATION_PLAN.md (3D visualization roadmap)
 * - ADAPTER_IMPLEMENTATION_STATUS.md (adapter development status)
 * - ELECTRUM_DEVELOPMENT_TODO.md (electrum adapter tasks)
 */

---

## 📚 **Implementation Plan References**

**🎯 [ThreeJS Implementation Plan](THREEJS_IMPLEMENTATION_PLAN.md)** - Detailed 3D blockchain visualization implementation roadmap

**🔌 [Adapter Implementation Status](backend/src/adapters/ADAPTER_IMPLEMENTATION_STATUS.md)** - Current status of Bitcoin Core and Electrum adapters

**🚧 [Electrum Development TODO](backend/src/adapters/electrum/ELECTRUM_DEVELOPMENT_TODO.md)** - Detailed electrum adapter development tasks

---

## Using This Document

- Every checklist item must satisfy gates: $, #, @, *, &, %, 🚀, 🔒, 📊, 🔄 as applicable.
- For each item, verify DoR → produce Artifacts → meet DoD before moving on.
- Keep PRs small and focused; one logical change per PR; link issues.

**⚠️ CRITICAL**: This system is **100% PASSIVE** and **READ-ONLY**. No user can ever write data to the Bitcoin blockchain through our platform.

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

- [x] CoreRpcAdapter Implementation **@ #** ✅ **COMPLETED**
  - Complete Bitcoin Core RPC adapter with production-ready status

- [x] HTTP API Endpoints **#** ✅ **COMPLETED**
  - `/electrum/health`, `/electrum/fee/estimates`, `/electrum/network/height`, `/electrum/network/mempool` endpoints with tests

- [x] Development Tooling **🚀** ✅ **COMPLETED**
  - TypeScript, ESLint, Prettier, Jest configured with npm scripts

### Electrum Integration Validation (COMPLETED - 2025-08-18)
- [x] Real Electrum Adapter Testing **@ # 📊** ✅ **COMPLETED**
  - Live electrs connection with Electrum v1.4 protocol, sub-200ms response

- [x] Protocol Compatibility **@ #** ✅ **COMPLETED**
  - Electrum v1.4 compatibility with `server.version` and `blockchain.estimatefee`

**📋 Adapter Development Status**: See [ADAPTER_IMPLEMENTATION_STATUS.md](backend/src/adapters/ADAPTER_IMPLEMENTATION_STATUS.md) for current implementation status

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

## Phase 1: ThreeJS Blockchain Visualization Foundation (COMPLETED - 2025-08-31)

### ThreeJS Package Setup & Dependencies ✅ **COMPLETED**
- [x] Three.js packages installed and configured **🚀 #**
- [x] Build system updates for 3D asset handling **🚀 #**
- [x] TypeScript config for ThreeJS types **🚀 #**

### ThreeJS Stage Architecture ✅ **COMPLETED**
- [x] Center column 3D container setup **🚀 #**
- [x] WebGL renderer with antialiasing **🚀 #**
- [x] Perspective camera and lighting system **🚀 #**
- [x] OrbitControls for user interaction **🚀 #**

### Blockchain Visualization System ✅ **COMPLETED**
- [x] 3D block representation with blockchain status colors **🚀 #**
- [x] Section-specific visualization (mempool, current, historical) **🚀 #**
- [x] Real blockchain data integration via enhanced hooks **🚀 #**
- [x] Performance monitoring and optimization **🚀 #**

### WebSocket Integration & Real-Time Updates ✅ **COMPLETED**
- [x] WebSocket event structure and architecture **🚀 #**
- [x] Event-driven blockchain update system **🚀 #**
- [x] Development simulation mode for testing **🚀 #**
- [x] Automatic reconnection and error handling **🚀 #**

### Theme System Integration ✅ **COMPLETED**
- [x] Theme-aware lighting system **🚀 #**
- [x] Section-specific camera positioning **🚀 #**
- [x] Dynamic theme adaptation (light/dark/cosmic) **🚀 #**
- [x] CSS custom properties integration **🚀 #**

### Performance Optimization ✅ **COMPLETED**
- [x] Performance baseline establishment **🚀 #**
- [x] Performance targets (FPS: 45-60, Render: 16-22ms, Memory: 100-200MB) **🚀 #**
- [x] Real-time performance monitoring **🚀 #**
- [x] Performance alert system **🚀 #**

### Interactive Features ✅ **COMPLETED**
- [x] Camera movement and controls **🚀 #**
- [x] Block hover effects and animations **🚀 #**
- [x] Section-specific block behaviors **🚀 #**
- [x] Responsive 3D interactions **🚀 #**

### Component Architecture ✅ **COMPLETED**
- [x] BlockchainVisualizer with status bar and performance alerts **🚀 #**
- [x] BlockchainScene with section-specific data orchestration **🚀 #**
- [x] Block component with real blockchain data display **🚀 #**
- [x] Scene component with theme-aware lighting and camera **🚀 #**
- [x] WebSocketHandler for real-time event processing **🚀 #**
- [x] PerformanceBaseline for monitoring and optimization **🚀 #**

**📋 Phase 1 Status**: ✅ **COMPLETED** - Ready for Phase 2 WebSocket integration and real-time blockchain updates

---

## Phase 1 & 2: Frontend Bundle Optimization (COMPLETED ✅)

### Bundle Size Optimization & Code Splitting
- [x] **Phase 1: Component-Level Splitting** ✅ **COMPLETED**
  - Dashboard component lazy loading implemented
  - Heavy 3D components lazy loading implemented
  - Enhanced Vite chunk optimization for 3D components
  - Import conflicts resolved and chunk separation optimized
  - **Impact**: 450-700KB bundle size reduction achieved

- [x] **Phase 2: Route-Based Splitting** ✅ **COMPLETED**
  - AppRouter component created with lazy loading
  - Centralized lazy page loading system implemented
  - App.tsx integrated with new router system
  - Vite configuration enhanced for route-based chunking
  - Router conflicts resolved and dev server functional
  - **Impact**: 100-200KB additional bundle reduction

**Total Bundle Optimization Achieved: 550-900KB reduction**
**Performance Improvement: 30-40% faster initial load + 15-25% route improvements**
**Status**: Production ready with comprehensive testing and documentation

---

## Phase 3: File Refactoring & Optimization (FUTURE - AFTER MVP MILESTONE)

### File Refactoring Strategy
- [ ] **File Size Analysis** - Identify large files for refactoring
- [ ] **Refactoring Planning** - Develop systematic refactoring strategy
- [ ] **Frontend Component Refactoring** - Split large components (>200 lines)
- [ ] **Backend Controller Refactoring** - Split large controllers (>300 lines)
- [ ] **Utility File Refactoring** - Organize large utilities (>150 lines)
- [ ] **Performance Validation** - Measure bundle size improvements
- [ ] **Documentation Updates** - Update system diagrams and guides

**Expected Impact**: Additional 100-200KB bundle reduction + improved maintainability
**Implementation Timeline**: 5 weeks after MVP completion
**Status**: 🔒 **PLANNING COMPLETE - Ready for implementation after MVP milestone**

**📋 Detailed Plan**: See [FILE_REFACTORING_PLAN.md](FILE_REFACTORING_PLAN.md) for comprehensive strategy

---

## Phase 1: MVP Frontend Development (COMPLETED - 2025-08-29)

### Frontend Foundation **🚀 #** ✅ **COMPLETED**
- [x] React Application Setup **🚀** ✅ **COMPLETED**
  - Complete Vite + React + TypeScript setup with clean compilation
  - Full component architecture with 15+ components
  - Working application with splash screen and animations

- [x] Bitcoin Data Display Components **# 📊** ✅ **COMPLETED**
  - Complete component structure for blocks/transactions/addresses
  - Dashboard layout with three-column responsive design
  - Theme-aware styling with CSS Modules and Custom Properties

- [x] Real-time Data Integration **@ 📊** ✅ **COMPLETED**
  - WebSocket integration working with real Bitcoin data
  - lastBlock height updates functional
  - Real-time data flow from backend to frontend

### Style System Implementation **🚀 #** ✅ **COMPLETED**
- [x] CSS Architecture **🚀** ✅ **COMPLETED**
  - CSS Modules for component isolation
  - CSS Custom Properties for theming (light/dark/cosmic)
  - Styled Components for interactive elements
  - Professional design tokens with Bitcoin color palette

- [x] Theme System **🚀** ✅ **COMPLETED**
  - Dynamic theme switching (light/dark/cosmic)
  - Cosmic background with theme integration
  - Responsive design with mobile-first approach

### Dashboard Implementation **🚀 #** ✅ **COMPLETED**
- [x] Layout System **🚀** ✅ **COMPLETED**
  - Three-column responsive layout (left/center/right)
  - Search results, blockchain visualizer, dashboard data
  - CSS Grid and Flexbox for complex layouts

- [x] Component Integration **🚀** ✅ **COMPLETED**
  - Header with theme toggle and language switching
  - Footer with responsive design
  - Loading animations and splash screen system

### Internationalization **🚀 #** ✅ **COMPLETED**
- [x] i18n Foundation **🚀** ✅ **COMPLETED**
  - i18next setup with EN/ES/HE/PT support
  - Language switching functionality
  - RTL support for Hebrew language

### Performance & Advanced Features **🚀 #** ✅ **COMPLETED**
- [x] Loading System **🚀** ✅ **COMPLETED**
  - LoadingBlocks component with 3D cube animations
  - Splash screen with 2s display + 2s fade-out
  - Smooth transitions and performance optimization

- [x] 3D Design System **🚀** ✅ **COMPLETED**
  - ThreeJS integration planning and architecture
  - 3D transforms and perspective system
  - Performance monitoring and optimization

### API Integration **@ #** ✅ **COMPLETED**
- [x] Backend Connection **@ #** ✅ **COMPLETED**
  - WebSocket real-time data flow
  - Bitcoin context with live data integration
  - Error handling and fallback mechanisms

- [x] Data Validation **@ #** ✅ **COMPLETED**
  - Bitcoin data types and interfaces
  - Pattern recognition utilities (non-blockchain specific) - **SCOPE: UI display only, NOT blockchain validation**
  - Type-safe data handling throughout application

- [x] Staging Environment **🚀** ✅ **COMPLETED**
  - Vercel frontend deployment operational
  - Ready for ThreeJS development and testing

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
**📋 Development Status**: See [ELECTRUM_DEVELOPMENT_TODO.md](backend/src/adapters/electrum/ELECTRUM_DEVELOPMENT_TODO.md) for detailed development tasks

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
  - Complete setup documentation in `docs/ENVIRONMENT-SETUP.md` and `docs/infrastructure/`

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

**📋 Adapter Development Status**: See [ADAPTER_IMPLEMENTATION_STATUS.md](backend/src/adapters/ADAPTER_IMPLEMENTATION_STATUS.md) for current implementation status

### electrs-integration
- [x] Electrum adapter interface + fake implementation (CI-friendly) **# 🚀** ✅ **COMPLETED**
  - Adapter interface, fake adapter, routes, controller, tests
- [x] Real Electrum adapter (env switch ELECTRUM_ENABLED) **$ # @** ✅ **COMPLETED**
  - RealElectrumAdapter with electrum-client, environment-driven switching
- [x] Electrum adapter testing and validation **# @ 📊** ✅ **COMPLETED**
  - Integration tests with real electrs, P95 <200ms to electrs

- [x] CoreRpcAdapter implementation **# @ 📊** ✅ **COMPLETED**
  - Complete Bitcoin Core RPC adapter with production-ready status

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

## Phase 2: ThreeJS Integration & Dashboard Widgets (CURRENT - 2025-08-29)

**📋 Implementation Guide**: Follow [THREEJS_IMPLEMENTATION_PLAN.md](THREEJS_IMPLEMENTATION_PLAN.md) for detailed roadmap

**🎯 Current Development Priority**: ThreeJS 3D blockchain visualization in center column

### ThreeJS Blockchain Visualization **🚀 # 🎨**
- [ ] ThreeJS Package Setup **🚀**
  - Install ThreeJS, React Three Fiber, and Drei
  - Configure 3D rendering in center column
  - Integrate with existing theme system

- [ ] 3D Block Representation **🎨 #**
  - 3D cube geometry for Bitcoin blocks
  - Blockchain status colors and materials
  - Real-time block updates from WebSocket

- [ ] Blockchain Structure Visualization **🎨 #**
  - Z-axis progression for blockchain depth
  - X-axis for block variations/status
  - Y-axis for block height/position
  - Connections between sequential blocks

- [ ] Performance Optimization **🚀 #**
  - 60fps 3D rendering target
  - Object pooling and LOD system
  - Memory management for blockchain data
  - Responsive 3D viewport

### Dashboard Widgets Implementation **🚀 # 📊**
- [ ] Bitcoin Price Dashboard **📊 #**
  - Real-time price feeds integration
  - Multi-currency support (12 fiat currencies)
  - Price charts and historical data
  - Theme-aware styling

- [ ] Bitcoin Fee Gauge **📊 #**
  - Real-time fee estimates from mempool
  - Confirmation time predictions
  - Fee history and trends visualization
  - Interactive fee recommendations

- [ ] Network Load Gauge **📊 #**
  - Real-time congestion monitoring
  - Confirmation time predictions
  - Network health indicators
  - Color-coded load levels

- [ ] Bitcoin Timeline **📊 #**
  - Horizontal block timeline with intervals
  - Delay detection and highlighting
  - Color-coded time intervals
  - Real-time block updates

### Search Functionality **🚀 # 📊**
- [ ] Block Search **📊 #**
  - Search by height, hash, or partial hash
  - Real-time search results
  - Block details and transaction count
  - Script analysis display

- [ ] Transaction Search **📊 #**
  - Search by transaction ID
  - Input/output analysis
  - Fee calculation and confirmation status
  - Script type detection

- [ ] Address Search **📊 #**
  - Search by Bitcoin address
  - Balance history and UTXO analysis
  - Transaction categorization
  - Privacy analysis indicators

### Integration & Polish **🚀 #**
- [ ] Real-time Data Enhancement **📊 #**
  - WebSocket event optimization
  - Data caching and invalidation
  - Performance monitoring
  - Error handling improvements

- [ ] User Experience Polish **🎨 #**
  - Smooth animations and transitions
  - Loading states and error messages
  - Responsive design optimization
  - Accessibility improvements

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
