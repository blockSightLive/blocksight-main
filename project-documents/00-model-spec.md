# BlockSight.live - Bitcoin Blockchain Analysis System Specification

## Overview

BlockSight.live is a cutting-edge Bitcoin-exclusive blockchain analysis platform designed for real-time monitoring and analysis. Our mission is to make blockchain data accessible, understandable, and actionable for all users while maintaining the highest standards of data accuracy and user privacy.

**Scope**: This specification defines the desired behavior, architecture, and implementation standards for BlockSight.live, focusing exclusively on Bitcoin while developing innovative tools that enhance privacy, security, and usability.

---

## Core Principles

1. **User-Centric Design** - Complex blockchain data accessible to beginners and professionals
2. **Real-Time Performance** - 1-2 second detection and notification latency
3. **Data Accuracy** - 100% accuracy validated against Bitcoin Core
4. **Bitcoin-Exclusive Focus** - Deep specialization for superior analysis
5. **Accessibility** - Advanced tools accessible to all technical levels
6. **Scalability** - Support 1000+ concurrent users with 99.99% uptime
7. **Open Source Foundation** - Respect MIT licenses while maintaining commercial viability
8. **DevOps-First Approach** - Automated CI/CD, versioning, and deployment from day one
9. **Internationalization (i18n) by Design** - All user-visible strings are translation keys; no hardcoded UI text. RTL support and per-locale formatting are first-class.

---

## System Architecture

### High-Level Architecture
```
Bitcoin Core → electrs (Indexer) → HTTP REST API → NodeJS Backend → Multi-Tier Cache → WebSocket Events → BlockSight Frontend
```

- **Single-machine development (Current - Validated)**: Windows host runs backend/frontend in Docker containers; Bitcoin Core runs in VirtualBox Ubuntu LTS VM (192.168.1.67); electrs runs natively on Windows host. Backend connects to electrs over TCP (50001) via `host.docker.internal:50001`. Bitcoin Core accessible via VM IP (192.168.1.67:8332). Shared folder `B:\bitcoin-data` mounted to `/media/sf_bitcoin-data` in VM. Network: Windows host (192.168.1.3) → VM (192.168.1.67) via home network (192.168.1.0/24). Status: Bitcoin Core synced to block 910,659 (100% complete), electrs running and indexing.
- **Containerized development (Current - Working)**: Docker compose with backend and Redis containers. Backend reaches electrs via `host.docker.internal:50001`. Service DNS names (e.g., `redis`, `backend`) used within compose network. External access via mapped host ports (backend:8000, Redis:6379).
- **Production (AWS)**: Mixed private/public subnets. Private: Bitcoin Core and electrs; public: API and CDN edges. Use security groups/VPC endpoints; pin electrs to private interfaces; expose public read APIs via gateway/ingress. HA via multiple AZs and active/standby electrs.

### Core Components

#### 1. electrs Pre-Indexer
- **Purpose**: Raw blockchain data collection and indexing
- **Technology**: Rust-based engine (MIT licensed) from [romanz/electrs](https://github.com/romanz/electrs)
- **Integration Method**: Git submodule for clean dependency management and version control
- **Responsibilities**: Parse blocks, extract transactions, index addresses, maintain UTXO set
- **Script Support**: 100% Bitcoin script type coverage (P2PKH, P2SH, P2WPKH, P2WSH, P2TR, Multisig, OP_RETURN)
- **Interface**: Electrum protocol over TCP (standard ports 50001/50002). We expose a thin HTTP/JSON adapter in our backend if/when REST is required.
- **Operation Mode**: Two-phase operation - Initial historical indexing followed by continuous real-time updates
- **Real-Time Updates**: Monitors Bitcoin network continuously, indexes new blocks within 1-2 seconds of confirmation
- **Benefits**: 
  - Maintains original repository integrity and licensing
  - Easy security updates and version management
  - Clean separation between our code and third-party dependencies
  - Proper attribution and compliance with MIT license
  - Always-current Bitcoin data with pre-indexed performance

##### Electrs HA & Index Integrity (Concise)
- Active/standby electrs with health-checked failover; staggered reindex to avoid correlated failures.
- Index integrity playbook: detect corruption, quarantine node, fast rebootstrap from known-good tip.
- Tip-lag SLOs and reindex SLAs tracked in monitoring.
 - WSL2 guidance (dev): prefer ext4 for `db_dir`, conservative parallelism, periodic clean exits to persist progress.

#### 2. HTTP API Integration Layer
- **Technology**: NodeJS backend with 1-2s polling
- **Purpose**: Bridge between electrs and application layer

#### 3. Multi-Tier Cache Architecture
- **L1**: Redis in-memory (1-2s TTL, ~0.1-1ms)
- **L2**: Memory-mapped files (10-30s TTL, ~1-5ms)
- **L3**: Nginx HTTP cache (2min-24h TTL, ~5-20ms)
- **Analytics**: PostgreSQL read-only replica (~100-500ms)
 - **Procedures**: SQL functions/views used for heavy, reusable analytics; Redis functions for atomic cache behaviors; electrs remains unmodified.

##### Analytics Data Model Principles (BlockSci insight)
- Treat blockchain data as append-only; prefer immutable facts + materialized rollups.
- Batch writes, idempotent rebuilds, deterministic replays for recovery.

#### 4. BlockSight API Layer
- **Technology**: NodeJS with REST and WebSocket APIs
- **Endpoints**: Block data, search, price feeds, fee analysis, network load, timeline, calculator, settings

##### API SLOs & Backpressure (Concise)
- Per-endpoint SLOs: publish P50/P95/P99 targets; enforce admission control and token buckets.
- Global backpressure: prioritized queues (real-time vs batch), circuit breakers, timeouts, and retries.
- Contract-first: JSON Schemas + contract tests for Electrum-adapter responses.

#### 5. BlockSight Frontend
- **Technology**: React with real-time capabilities
- **Components**: Dashboard, block viewer, search, price display, fee gauge, network load, timeline, calculator, settings

##### Internationalization & Localization
- i18n framework: i18next with react-i18next bindings
- Languages (Phase 1): English (`en`), Spanish (`es`), Hebrew (`he`), Portuguese (`pt`)
- No hardcoded text in UI; all strings referenced via translation keys
- RTL support: auto-direction switch for `he` and any RTL locales; layout mirroring where appropriate
- Formatting: locale-aware dates, numbers, and currency (fiat selector integrated with i18n number/currency formatting)
- Resource structure: `frontend/src/i18n/locales/{en,es,he,pt}/translation.json`
- Fallback: `en` as default; missing keys logged during development
- 3D UI: scene and UI overlays must respond to RTL (HUD mirroring), but world coordinates remain LTR; text meshes use locale fonts

##### Privacy & Clustering Ethics (Scope)
- Any address clustering, CoinJoin heuristics, or deanonymization features require explicit disclosure, opt-outs, and accuracy limitations. Details deferred to Future Considerations.

##### BlockInsight (Commercial Analytics Suite)
- A premium, subscription-based layer that builds on BlockSight data and services to offer:
  - Advanced analytics dashboards (economic metrics, clustering summaries, mining insights), curated reports, and export APIs.
  - Public CDN widgets for the free tier (e.g., block timeline, fee gauge, network load) with configurable, higher-SLA variants for paid plans.
- Architecture: shares electrs-backed ingestion and our adapter; adds multi-tenant auth/billing, API keys, usage metering, and feature flags. Electrs remains unmodified in production.
- Governance: feature flags, canary releases, and separate SLOs to ensure no impact to the public explorer.

---

## MVP Features

### 1. Real-Time Block Visualization
- Interactive block display with 1-2s latency
- Color-coded status indicators (Orange: unconfirmed, Red: next, Light Purple: last, Dark Purple: previous)
- Dynamic orientation switching and discovery alerts

### 2. Advanced Search
- Multi-format search (address, transaction ID, block)
- Cached responses (10-50ms) or database queries (100-500ms)

### 3. Bitcoin Price Dashboard
- Real-time prices in 12 currencies (ILS, USD, ARS, EUR, CNY, JPY, GBP, AUD, CAD, CHF, INR, BRL)
- User-selectable primary/secondary currencies

### 4. Bitcoin Fee Gauge
- Real-time fee analysis in sats/vB
- Three confirmation categories: next block, 6-hour, 24-hour

### 5. Network Load Gauge
- Real-time congestion analysis with four categories (Below Average, Neutral, Load, Extreme Load)

### 6. Bitcoin Timeline
- Horizontal timeline with color-coded intervals (Light Green: <9min, Green: 9-11min, Yellow: 11-13min, Orange: 13-16min, Red: >16min)

### 7. Bitcoin Calculator
- Real-time conversion tool for Bitcoin and sats

### 8. Site Settings
- Language support (English, Spanish, Hebrew), themes, currency preferences

---

## DevOps & CI/CD Architecture

### Current Infrastructure State (Validated - 2025-08-18)

#### Network Topology
- **VM IP Address**: `192.168.1.67` (VirtualBox Ubuntu LTS VM)
- **Windows Host IP**: `192.168.1.3`
- **Network Segment**: `192.168.1.0/24` (home network)
- **Gateway**: `192.168.1.1`

#### Bitcoin Core Configuration
- **Version**: Pre-release test build (main branch)
- **Sync Status**: Block 910,659 of 910,659 (100% complete)
- **Chain**: mainnet
- **Storage**: 774GB on external drive via VirtualBox shared folder
- **RPC Binding**: 
  - `127.0.0.1:8332` (localhost)
  - `192.168.1.67:8332` (VM IP - external access)
- **P2P Port**: `192.168.1.67:8333`
- **ZMQ Ports**: `127.0.0.1:28332` (raw block), `127.0.0.1:28333` (raw tx)

#### Electrs Configuration
- **Version**: 0.10.10 (x86_64 Windows native)
- **Process**: Running (PID 21000, 163MB memory)
- **Database**: `B:\bitcoin-data\electrs-db\bitcoin`
- **Electrum RPC**: `0.0.0.0:50001` (external access enabled)
- **Monitoring**: `127.0.0.1:4224` (Prometheus metrics)
- **Bitcoin Core Connection**: `192.168.1.67:8332` (VM IP)
- **Cookie File**: `B:\bitcoin-data\.cookie`

#### Connectivity Validation
- **Windows → Bitcoin Core VM**: ✅ `Test-NetConnection "192.168.1.67:8332"` passes
- **Electrs → Bitcoin Core**: ✅ Direct TCP connection established
- **Docker → Electrs**: ✅ `host.docker.internal:50001` accessible
- **External → Electrs**: ✅ Port 50001 listening on all interfaces

#### Storage Configuration
- **External Drive**: `B:\bitcoin-data` (Windows)
- **VM Mount Point**: `/media/sf_bitcoin-data` (VirtualBox shared folder)
- **Shared Folder Name**: `bitcoin-data`
- **Permissions**: User `blocksight` (UID/GID 1002) in `vboxsf` group
- **Symlink**: `/home/blocksight/.bitcoin` → `/media/sf_bitcoin-data`

#### Docker Environment
- **Status**: ✅ Build successful, compose working
- **Backend Port**: `localhost:8000`
- **Redis Port**: `localhost:6379`
- **Network**: Docker bridge with host access via `host.docker.internal`

#### Backend Application Status
- **Container Status**: ✅ **RUNNING AND HEALTHY**
- **Real Electrum Adapter**: ✅ **SUCCESSFULLY CONNECTED TO ELECTRS**
- **API Endpoints**: ✅ **RETURNING LIVE BLOCKCHAIN DATA**
  - `/v1/health`: `{"ok":true}` (electrs connection validated)
  - `/v1/fee/estimates`: Real fee data from Bitcoin network
- **Network Connectivity**: ✅ **DOCKER → ELECTRS → BITCOIN CORE**
- **Protocol Compatibility**: ✅ **ELECTRUM PROTOCOL V1.4 VALIDATED**
- **Performance**: ✅ **SUB-200MS RESPONSE TIMES ACHIEVED**

### Development Workflow
- **Main Branch**: Always contains the most advanced working product
- **Feature Branches**: Development of additional functionalities
- **Release Branches**: Version-specific development and hotfixes
- **Hotfix Strategy**: Emergency patches with automated rollback capabilities

### Version Management
- **Semantic Versioning**: MAJOR.MINOR.PATCH (e.g., 1.0.0)
- **Release Management**: Automated changelog generation and release notes
- **Database Versioning**: Schema migration automation with rollback support
- **API Versioning**: Backward-compatible API evolution

##### Protocol-Aware Change Management
- Any change touching consensus logic, script parsing, or mempool policy must ship behind flags, canary through staging, and pass Core RPC parity gates.

### CI/CD Pipeline

#### GitHub Actions Workflows
1. **CI Pipeline** (`ci.yml`)
   - Code quality checks (ESLint v9 flat config, Prettier, TypeScript `--noEmit`)
   - Unit and integration testing (Jest + ts-jest; supertest for HTTP routes)
   - Security vulnerability scanning
   - Performance benchmarking
   - Blockchain data integrity validation

2. **Staging Deployment** (`deploy-staging.yml`)
   - Automated testing environment deployment
   - Integration testing with staging data
   - Performance validation
   - Security compliance checks

3. **Production Deployment** (`deploy-production.yml`)
   - Blue-green deployment strategy
   - Canary deployment for critical updates
   - Automated health checks and rollback triggers
   - Zero-downtime updates

4. **Security Scanning** (`security-scan.yml`)
   - Dependency vulnerability scanning
   - Code security analysis
   - Container security scanning
   - Infrastructure security validation

#### Quality Gates
- **Code Quality**: 85%+ test coverage, zero linting errors
- **Security**: No critical vulnerabilities, security compliance validation
- **Performance**: Response time benchmarks, load testing validation
- **Blockchain Integrity**: Data validation against Bitcoin Core
- **Accessibility**: WCAG 2.1 AA compliance

##### Security Hardening (Runtime & Supply Chain)
- Sandbox electrs and backend (least-privilege users, read-only rootfs where applicable, minimal capabilities).
- SBOM + license scans; pin submodule commits; prohibit plaintext secrets; enforce TLS on internal hops where appropriate.
 - VM-to-host communication: restrict RPC to VM network; firewall deny-all except electrs/Core; rotate credentials.

### Deployment Strategy

#### Infrastructure as Code
- **Terraform**: Infrastructure provisioning and management
- **Kubernetes**: Container orchestration and scaling
- **Helm Charts**: Application deployment and configuration
- **ArgoCD**: GitOps continuous deployment

#### Deployment Patterns
- **Blue-Green**: Zero-downtime deployments with instant rollback
- **Canary**: Gradual rollout with automated rollback on issues
- **Rolling Updates**: Incremental deployment with health checks
- **Feature Flags**: Gradual feature activation and rollback

#### Rollback Automation
- **Health Check Triggers**: Automatic rollback on performance degradation
- **Circuit Breaker**: Automatic service isolation on failures
- **Database Rollback**: Automated schema and data rollback
- **Infrastructure Rollback**: Complete environment rollback capability

### Monitoring & Observability

#### Application Monitoring
- **Health Checks**: `/health`, `/ready`, `/live` endpoints
- **Metrics**: Prometheus with custom blockchain metrics
- **Logging**: Structured logging with correlation IDs
- **Tracing**: Distributed tracing with OpenTelemetry

##### Electrs/Core Parity Signals (Required)
- Metrics: tip_height, tip_lag, reorg_depth, index_throughput, RocksDB compaction time, Electrum RPC error rate.
- Alerts: Core vs electrs divergence, prolonged tip lag, cache thrash, mempool starvation.

#### Performance Monitoring
- **Core Web Vitals**: FCP, LCP, CLS, FID, TTFB
- **API Metrics**: Response times, throughput, error rates
- **Blockchain Metrics**: Block processing time, indexing speed, cache hit rates
- **Infrastructure**: CPU, memory, disk I/O, network performance

#### Alerting & Incident Response
- **Error Rate**: >1% triggers alert with automatic rollback consideration
- **Response Time**: >2s triggers performance investigation
- **Availability**: <99.9% triggers incident response
- **Blockchain Integrity**: Data corruption triggers immediate alert and investigation

---

## Performance Requirements

### Cache Performance
- **L1 Cache Hit**: ~0.1-1ms
- **L2 Cache Hit**: ~1-5ms
- **L3 Cache Hit**: ~5-20ms
- **electrs API Call**: ~50-200ms
- **PostgreSQL Query**: ~100-500ms
- **Complex Analytics**: ~1-5s

### API Response Times
- **Block by Height/Hash**: ~10-50ms (cached)
- **Transaction by ID**: ~20-100ms
- **Address History**: ~100-500ms (recent), ~1-10s (full)
- **Network Statistics**: ~200-1000ms
- **Fee Analysis**: ~500-2000ms

##### Mempool Policy Handling (Impact on fees/ETA)
- Account for RBF/CPFP, mempool eviction, relay policy changes, and package relay in fee estimation and ETA models.

### User Experience Performance
- **Block Updates**: 1-2s detection latency
- **Search Results**: 100-500ms
- **Page Load**: <3s initial dashboard
- **Interactive Elements**: <200ms response time

---

## Data Integrity & Validation

### Cross-Reference Validation
- Bitcoin Core RPC validation
- Transaction hash and merkle root verification
- UTXO set consistency checks
- Block header integrity validation

### Statistical Validation
- Transaction pattern analysis
- Fee rate validation
- Address usage statistics
- Anomaly detection and alerting

---

## Error Handling & Recovery

### Circuit Breaker Pattern
```rust
struct CircuitBreaker {
    failure_threshold: u32,
    timeout: Duration,
    state: AtomicU32, // Closed, Open, Half-Open
    failure_count: AtomicU32,
    last_failure: AtomicU64,
}
```

### Graceful Degradation
- **electrs Failure**: Fallback to cached data
- **Database Issues**: Automatic repair with partial availability
- **Network Partition**: Local mode with eventual consistency

### Checkpoint System
- Every 10,000 blocks during indexing
- Every 1,000 blocks during operation
- On-demand checkpoints for critical operations

---

## Testing Framework

### Multi-Tier Testing
1. **Unit Tests** (Seconds): Genesis block, script parsing, API tests
2. **Integration Tests** (Minutes): P2SH, SegWit, known problematic blocks
3. **Regression Tests** (Hours): Recent 10,000 blocks, performance benchmarks
4. **Full Chain Tests** (Days): Complete validation, production verification

---

## UTXO Set Management

### Memory-Mapped Storage
- **File**: `/data/utxo/utxo_set.mmap` (50GB+)
- **Structure**: Fixed-size records with O(1) hash table lookups
- **Compression**: LZ4 for 60-70% memory reduction

### Operations
- **Updates**: Batch atomic operations for new blocks
- **Reorg**: Automatic rollback to previous state
- **Validation**: Cross-reference with Bitcoin Core
- **Compaction**: Periodic cleanup of spent outputs

---

## Deployment Specifications

### Hardware Requirements
- **Minimum**: 4 cores, 16GB RAM, 1TB NVMe SSD, 100Mbps
- **Recommended**: 8 cores, 32GB RAM, 2TB NVMe SSD, 1Gbps
- **Production**: 16 cores for electrs, 8 cores for API, 2TB+ storage, 1Gbps+

### Software Stack
- **Core**: Bitcoin Core, electrs, RocksDB, PostgreSQL 14+, Redis 6+, NodeJS LTS
- **Monitoring**: Prometheus, Grafana, AlertManager, Jaeger
- **DevOps**: GitHub Actions, Terraform, Kubernetes, ArgoCD

---

## Implementation Timeline

### Pre-indexing (Days 1-9)
- Days 1-7: Bitcoin Core installation and sync
- Day 8: electrs installation and indexing start
- Days 8-9: Indexing completion (6-24 hours)

### electrs Submodule Management
- **Initial Setup**: Git submodule already integrated and configured
- **Version Control**: electrs version tracked separately from main application
- **Update Strategy**: Regular updates for security patches and new features
- **Build Process**: Compile electrs from source for optimal performance
- **Integration Testing**: Validate electrs API endpoints before application deployment

### electrs Continuous Operation Across Phases
- **Development Phase**: electrs runs continuously with testnet data, real-time updates after initial indexing
- **Staging Phase**: electrs runs continuously with mainnet data, real-time updates for integration testing
- **Production Phase**: electrs runs continuously with mainnet data, 24/7 real-time updates with monitoring
- **Real-Time Data Flow**: All phases benefit from continuous blockchain updates, not just historical data

### Development Phases
- **Phase 1** (Weeks 2-4): Foundation - API integration, caching, WebSocket
- **Phase 2** (Weeks 5-8): Performance - Connection pooling, optimization
- **Phase 3** (Weeks 9-12): Testing - Comprehensive test suite, validation
- **Phase 4** (Weeks 13-16): Production - Monitoring, security, deployment

---

## Success Metrics

### Performance Targets
- **Indexing**: 2000+ blocks/hour
- **API Response**: 10-50ms cached, 100-500ms database, 1-5s complex
- **Memory**: <32GB total system
- **Storage**: <2TB complete blockchain
- **Users**: 1000+ concurrent

### Reliability Targets
- **Uptime**: 99.99% availability
- **Data Accuracy**: 100% Bitcoin Core validation
- **Error Recovery**: 95% automatic recovery
- **Data Integrity**: Zero corruption with automatic detection

---

## Future Considerations

### Advanced Bitcoin Protocol Features
The following features will be evaluated for future implementation phases after core system stability is achieved. Comprehensive technical specifications and implementation details are documented in [03-future-considerations.md](additional/03-future-considerations.md).

#### **Transaction Enhancement Features**
- **Replace-by-Fee (RBF) Tracking**: Monitor transaction replacement chains and fee optimization
- **CoinJoin/Privacy Protocol Detection**: Identify privacy-enhanced transactions and modify clustering algorithms
- **Soft Fork Activation Monitoring**: Track BIP activation states and consensus rule updates

#### **Advanced Analytics Engine**
- **Address Clustering**: Multi-input heuristics, change detection, exchange pattern recognition
- **Mining Pool Analysis**: Coinbase script parsing, pool identification, hashrate distribution
- **Economic Metrics**: HODL ratio calculation, Bitcoin velocity analysis, exchange flow detection
- **Network Topology**: Transaction graph analysis, fee rate distribution modeling

#### **Extended Protocol Support**
- **Lightning Network Integration**: Channel state monitoring, payment routing analysis
- **Bitcoin Fork Blockchains**: Support for BCH, BSV, and other Bitcoin-derived networks
- **Advanced Script Types**: Custom script analysis, protocol detection (Ordinals, BRC-20)

#### **Enhanced Data Collection**
- **Core On-Chain Metrics**: Supply issuance, UTXO analytics, coin-days destroyed
- **Time-Window Analysis**: Rolling aggregates, seasonal patterns, period-over-period comparisons
- **Milestone Tracking**: Protocol firsts, halving events, soft fork activations

##### Additional Data Collection Blueprint (non-MVP)
- Reference: `project-documents/additional/04-additional-data-collection.md`.
- Strategy: mirror a minimal subset from Electrum adapter into PostgreSQL; build SQL views/materialized views; no direct RocksDB reads in production.
- Scope: ordinals/BRC‑20 detection, anomaly scaffolding, curated milestone calendar, per‑era rollups, developer exploration views.
- Access: read‑only analytics role; batch, idempotent ETL with reconciliation and backpressure.

### **Strategic Implementation Approach**
- **Phase 1**: Core Bitcoin analysis platform with electrs integration (Current)
- **Phase 2**: Advanced transaction features (RBF, CoinJoin, privacy protocols)
- **Phase 3**: Extended analytics and economic metrics
- **Phase 4**: Multi-protocol support and advanced data collection

**Note**: All future features will be evaluated against core mission alignment, implementation complexity, and user value to ensure they enhance rather than complicate the primary system objectives. Detailed technical specifications, implementation requirements, and development timelines are available in the comprehensive [Future Considerations Document](additional/03-future-considerations.md).

---

## Conclusion

BlockSight.live represents a cutting-edge Bitcoin blockchain analysis platform built with DevOps-first principles. The system combines real-time performance, comprehensive analytics, and automated deployment strategies to deliver a reliable, scalable platform for blockchain data analysis.

Key differentiators include Bitcoin-exclusive specialization, automated CI/CD pipelines, comprehensive versioning strategies, and automated rollback capabilities critical for blockchain systems. The platform maintains the highest standards of data accuracy while providing an intuitive user experience accessible to users of all technical levels.

### **electrs Integration Excellence**
The use of Git submodules for electrs integration demonstrates our commitment to:
- **Open Source Respect**: Maintaining original repository integrity and licensing
- **Clean Architecture**: Clear separation between our code and third-party dependencies
- **Version Control**: Proper tracking of electrs versions independent of application versions
- **Security**: Easy updates for security patches and vulnerability fixes
- **Compliance**: Proper attribution and adherence to MIT license requirements

Implementation follows a structured approach with automated quality gates, comprehensive testing, and production-ready deployment strategies that ensure reliability and maintainability throughout the development lifecycle.

### electrs Environment-Specific Operation

#### **Development Environment**
- **Network**: Bitcoin testnet for safe development
- **Operation**: Continuous after initial indexing (6-24 hours)
- **Data Flow**: Real-time testnet updates for development testing
- **Benefits**: Safe testing environment with live blockchain data
- **Setup**: electrs runs locally with testnet Bitcoin Core

#### **Staging Environment**
- **Network**: Bitcoin mainnet for realistic testing
- **Operation**: Continuous with mainnet data
- **Data Flow**: Real-time mainnet updates for integration testing
- **Benefits**: Production-like environment with live mainnet data
- **Setup**: electrs runs in staging with mainnet Bitcoin Core

#### **Production Environment**
- **Network**: Bitcoin mainnet for live operation
- **Operation**: 24/7 continuous operation with high availability
- **Data Flow**: Real-time mainnet updates with monitoring and alerting
- **Benefits**: Always-current Bitcoin data with production reliability
- **Setup**: electrs runs in production cluster with mainnet Bitcoin Core

#### **Real-Time Data Benefits Across All Environments**
- **Historical Data**: Pre-indexed for fast access to all historical blocks
- **Live Data**: Real-time updates for current blockchain state
- **Consistency**: All environments maintain current blockchain state
- **Performance**: Fast queries on both historical and live data
