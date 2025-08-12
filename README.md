# 🚀 BlockSight.live - Bitcoin Blockchain Analysis Platform

## 📚 Docs index
- New here? Start with `docs/README.md` for a quick map of all developer docs (handbook, standards, automation, onboarding).

## 📋 Project Overview

**BlockSight.live** is a cutting-edge Bitcoin-exclusive blockchain analysis platform designed to make blockchain data accessible, understandable, and actionable for all users. This platform provides real-time insights, advanced analytics, and comprehensive reporting tools for Bitcoin blockchain analysis.

**Key Differentiators:**
- **Bitcoin-Exclusive Focus**: Deep specialization for superior analysis
- **DevOps-First Approach**: Automated CI/CD, versioning, and deployment from day one
- **Real-Time Performance**: 1-2 second detection and notification latency
- **Automated Rollback**: Critical for blockchain system reliability

## 🎯 Mission & Vision

- **Bitcoin-Exclusive Focus**: Specialized for Bitcoin rather than generic cryptocurrency coverage
- **User-Centric Design**: Accessible to both technical and non-technical users
- **Real-Time Analytics**: Live blockchain data processing and visualization
- **Advanced Insights**: Sophisticated analysis tools for deep blockchain understanding
- **Educational Platform**: Learning resources and tutorials for blockchain concepts

---

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React 18+ with TypeScript, Next.js 14
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with TimescaleDB for time-series data
- **Blockchain**: Bitcoin Core integration, Lightning Network support
- **Real-time**: WebSocket connections, Server-Sent Events
- **Analytics**: Custom algorithms, statistical analysis engines
- **Deployment**: Docker containers, Kubernetes orchestration
- **DevOps**: GitHub Actions, Terraform, ArgoCD, Prometheus, Grafana

### electrs Integration
- **Bitcoin Indexing Engine**: [electrs](https://github.com/romanz/electrs) integrated as Git submodule
- **Technology**: Rust-based Bitcoin blockchain indexer (MIT licensed)
- **Purpose**: Pre-indexes entire Bitcoin blockchain for fast query performance
- **Integration Method**: Git submodule for clean dependency management
- **Continuous Operation**: Runs continuously with real-time blockchain updates after initial indexing
- **Benefits**: 
  - Maintains original electrs repository integrity
  - Easy version updates and security patches
  - Clean separation between our code and third-party dependencies
  - Proper attribution and licensing compliance
  - Always-current Bitcoin data with pre-indexed performance

### electrs Continuous Operation
electrs operates in two distinct phases:

#### **Phase 1: Initial Historical Indexing**
- **Duration**: 6-24 hours depending on hardware
- **Process**: Indexes entire blockchain from block 0 to current tip
- **Output**: Complete historical Bitcoin data index
- **Status**: System not ready for production use

#### **Phase 2: Continuous Real-Time Operation**
- **Mode**: Continuous operation with real-time updates
- **Process**: Monitors Bitcoin network for new blocks and transactions
- **Updates**: Indexes new blocks immediately as they arrive
- **Latency**: 1-2 seconds from block confirmation to index update
- **Status**: System fully operational with live data

#### **Environment-Specific Operation**

**Development Environment:**
- electrs runs continuously during development
- Initial indexing completed once, then real-time updates begin
- Bitcoin testnet for safe development and testing
- Your application can start development immediately after initial indexing

**Staging Environment:**
- Same continuous operation pattern as production
- Uses mainnet data for realistic testing
- Real-time data flow for integration testing
- Performance validation with live Bitcoin network

**Production Environment:**
- High-availability electrs instance
- Continuous real-time updates 24/7
- Automatic failover and recovery
- Monitoring and alerting for any indexing issues

### BlockInsight (Commercial Analytics Suite)
- Subscription-based, premium analytics that extends the public BlockSight explorer.
- Adds advanced dashboards (economic metrics, address clustering summaries, mining analysis), export APIs, and curated reports.
- Access model: authenticated users with active subscription; API keys for programmatic access; higher rate limits and SLAs.
- Public CDN widgets: embeddable, cacheable components for the free tier, e.g., block timeline, fee gauge, network load graph. Commercial plans unlock configurable themes and higher refresh rates.
- Architecture: shares electrs-backed data and our backend adapter; adds multi-tenant auth/billing, feature flags, and usage metering. No modifications to electrs in production.
- Availability: staged rollout after MVP; detailed docs will live under `project-documents/blockinsight/` in a later phase.

### Core Components
- **Data Ingestion Engine**: Real-time blockchain data collection
- **Analysis Engine**: Mathematical and statistical analysis algorithms
- **Visualization Engine**: Interactive charts and dashboards
- **API Gateway**: RESTful and GraphQL endpoints
- **Authentication System**: Multi-factor authentication, role-based access
- **Notification System**: Real-time alerts and updates
- **DevOps Engine**: Automated CI/CD, versioning, and deployment management

---

## 📁 Project Structure

```
blocksight-main/
├── project-documents/             # Project documentation and specifications
│   ├── 00-model-spec.md          # Core system model specification
│   ├── 01-development-roadmap.md      # High-level roadmap with DevOps strategy
│   ├── 02-technical-implementation.md # ALL technical details
│   ├── additional/                # Additional planning and future considerations
│   │   ├── 03-future-considerations.md   # Advanced features for future phases
│   │   └── 04-additional-data-collection.md # Additional data collection details
│   └── system-diagrams/          # Technical architecture diagrams
├── electrs/                       # Bitcoin indexing engine (Git submodule)
│   ├── src/                      # Rust source code
│   ├── Cargo.toml               # Rust dependencies
│   └── README.md                # electrs documentation
├── src/                           # Source code (to be created)
│   ├── frontend/                 # React frontend application
│   ├── backend/                  # Node.js backend services
│   ├── shared/                   # Shared types and utilities
│   └── tests/                    # Test suites
├── config/                        # Configuration files
├── scripts/                       # Build and deployment scripts
├── docs/                          # API documentation
├── docker/                        # Docker configuration files
├── .github/                       # GitHub Actions workflows
├── package.json                   # Root package configuration
├── tsconfig.json                  # TypeScript configuration
├── .env.example                   # Environment variables template
├── .gitmodules                    # Git submodule configuration
├── pocket-guide.md                # Developer Pocket Guide (legend + toolkit explained)
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18.17.0 or higher
- **npm**: 9.0.0 or higher
- **Docker**: 20.10.0 or higher
- **PostgreSQL**: 15.0 or higher
- **Git**: 2.30.0 or higher

### System Requirements
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: Minimum 10GB free space
- **CPU**: Multi-core processor recommended
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+

### Installation

1. **Clone the repository with submodules**
   ```bash
   git clone --recursive https://github.com/your-org/blocksight-main.git
   cd blocksight-main
   ```
   
   **Note**: The `--recursive` flag is essential to include the electrs submodule. If you forgot, run:
   ```bash
   git submodule init
   git submodule update
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development environment**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Documentation: http://localhost:3000/docs

---

## ⚙️ Environment Variables

### Required Environment Variables
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/blocksight
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=blocksight
DATABASE_USER=username
DATABASE_PASSWORD=password

# Bitcoin Node Configuration
BITCOIN_RPC_HOST=localhost
BITCOIN_RPC_PORT=8332
BITCOIN_RPC_USER=username
BITCOIN_RPC_PASSWORD=password

# API Configuration
API_PORT=8000
API_HOST=localhost
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# External Services
SENTRY_DSN=your-sentry-dsn
ANALYTICS_KEY=your-analytics-key

# Development
NODE_ENV=development
LOG_LEVEL=debug
```

### Optional Environment Variables
```bash
# Performance Tuning
MAX_CONNECTIONS=100
REQUEST_TIMEOUT=30000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Security
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=your-session-secret
```

---

## 🧪 Testing

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # End-to-end tests only

# Run tests with specific configuration
npm run test:ci           # CI environment
npm run test:debug        # Debug mode
```

### Test Structure
```
src/tests/
├── unit/                  # Unit tests for individual functions
├── integration/           # Integration tests for API endpoints
├── e2e/                  # End-to-end user flow tests
├── fixtures/             # Test data and mock objects
├── helpers/              # Test utility functions
└── setup/                # Test configuration and setup
```

### Testing Standards
- **Coverage Target**: ≥ 85% for unit tests
- **Test Naming**: Descriptive names that explain the scenario
- **Mock Strategy**: Use real dependencies when possible, mock external services
- **Data Isolation**: Each test should have isolated data
- **Performance**: Tests should complete within 2 seconds

---

## 🛠️ Development Environment

### IDE Setup
- **VS Code Extensions**: 
  - TypeScript Importer
  - ESLint
  - Prettier
  - GitLens
  - Docker
  - REST Client

### Git Configuration
```bash
# Set up git hooks
git config core.hooksPath .githooks

# Configure commit message format
git config commit.template .gitmessage

# Set up branch protection
git config branch.main.protect true
```

### Local Development
- Single‑machine setup (Windows host + Linux VM):
  - Run Bitcoin Core inside a Linux VM (e.g., WSL2/VirtualBox/VMware). Expose RPC (`8332`) and P2P (`8333`) only to the host or private network.
  - Run electrs on Windows host, configured to point at the VM’s Core RPC/P2P addresses. Ensure time sync and fast SSD storage for RocksDB.
  - Frontend/Backend run on Windows host; connect to electrs over localhost; Core remains isolated in the VM.
- **Hot Reload**: Enabled for both frontend and backend
- **Debug Mode**: Available for Node.js and React
- **Environment**: Uses `.env.local` for local overrides
- **Ports**: Frontend (3000), Backend (8000), Database (5432)

### Internationalization
- i18n is foundational. We use i18next with translation files under `frontend/src/i18n/locales/{en,es,he,pt}/translation.json`.
- No hardcoded UI text; use translation keys only. RTL (e.g., Hebrew) flips layout direction appropriately.
- Currency/date/number formatting are locale-aware; fiat currency selection integrates with formatting.

---

## 🚀 Development Commands

### Development Workflow
```bash
# Start development servers
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Build the application
npm run build            # Build for production
npm run build:dev        # Build for development
npm run build:analyze    # Analyze bundle size

# Code quality checks
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues automatically
npm run typecheck        # TypeScript type checking
npm run format           # Format code with Prettier

# Database operations
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with test data
npm run db:reset         # Reset database (development only)
npm run db:backup        # Create database backup

# Docker operations
npm run docker:build     # Build Docker images
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View Docker logs
```

### Build and Deployment
```bash
# Production build
npm run build:prod       # Production build
npm run build:analyze    # Bundle analysis
npm run build:test       # Test build process

# Deployment
npm run deploy:staging   # Deploy to staging
npm run deploy:prod      # Deploy to production
npm run deploy:rollback  # Rollback deployment

# Monitoring
npm run health:check     # Health check endpoints
npm run logs:view        # View application logs
npm run metrics:view     # View performance metrics
```

---

## 🔧 Configuration Files

### TypeScript Configuration
- **tsconfig.json**: Root TypeScript configuration
- **tsconfig.frontend.json**: Frontend-specific configuration
- **tsconfig.backend.json**: Backend-specific configuration
- **tsconfig.shared.json**: Shared types configuration

### Build Configuration
- **webpack.config.js**: Webpack configuration for frontend
- **vite.config.ts**: Vite configuration (alternative build tool)
- **rollup.config.js**: Rollup configuration for libraries

### Linting and Formatting
- **.eslintrc.js**: ESLint rules and configuration
- **.prettierrc**: Prettier formatting rules
- **.stylelintrc**: StyleLint configuration for CSS

---

## 🐳 Docker Configuration

### Docker Compose Services
```yaml
# Development environment
docker-compose.dev.yml

# Production environment
docker-compose.prod.yml

# Testing environment
docker-compose.test.yml
```

### Container Management
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View running containers
docker-compose ps

# View logs for specific service
docker-compose logs -f backend

# Execute commands in containers
docker-compose exec backend npm run test

# Scale services
docker-compose up -d --scale backend=3
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows
- **`.github/workflows/ci.yml`**: Continuous Integration
- **`.github/workflows/deploy-staging.yml`**: Staging Deployment
- **`.github/workflows/deploy-production.yml`**: Production Deployment
- **`.github/workflows/security-scan.yml`**: Security Scanning

### Pipeline Stages
1. **Code Quality**: Linting, type checking, formatting
2. **Testing**: Unit, integration, and E2E tests
3. **Security**: Dependency scanning, code analysis
4. **Build**: Create production artifacts
5. **Deploy**: Deploy to staging/production environments

See `docs/automation-playbook.md` for the end-to-end automation model (one-time repo setup vs per-developer tasks) and recommended GitHub workflows.

### Quality Gates
- All tests must pass
- Code coverage ≥ 85%
- No security vulnerabilities
- Performance benchmarks met
- Accessibility standards compliance
- Blockchain data integrity validation
- DevOps compliance and automation checks

### Performance Benchmarks
- **Build Time**: < 2 minutes for clean build
- **Test Execution**: < 30 seconds for unit tests
- **Bundle Size**: < 1MB initial load
- **API Response**: < 200ms for simple queries
- **Database Queries**: < 100ms for indexed queries

---

## 📊 Monitoring and Observability

### Application Monitoring
- **Health Checks**: `/health`, `/ready`, `/live` endpoints
- **Metrics**: Prometheus metrics endpoint
- **Logging**: Structured logging with correlation IDs
- **Tracing**: Distributed tracing with OpenTelemetry

### Performance Monitoring
- **Core Web Vitals**: FCP, LCP, CLS, FID, TTFB
- **API Response Times**: P50, P95, P99 percentiles
- **Database Performance**: Query execution times, connection pools
- **Resource Usage**: CPU, memory, disk I/O

### Alerting
- **Error Rate**: > 1% error rate triggers alert
- **Response Time**: > 2s response time triggers alert
- **Availability**: < 99.9% uptime triggers alert
- **Resource Usage**: > 80% resource utilization triggers alert

---

## 🔒 Security

### Security Measures
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Comprehensive input sanitization
- **CORS**: Configured cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse
- **HTTPS**: TLS encryption for all communications

### Security Headers
```typescript
// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

---

## 📄 Documentation

### **Core Documentation Structure**

**📋 [Model Specification](project-documents/00-model-spec.md)** - Core system requirements, architecture overview, and implementation standards

**🚀 [Development Roadmap](project-documents/01-development-roadmap.md)** - High-level development phases, DevOps methodology, and module ownership

**🧩 [Execution Checklists](project-documents/01-execution-checklists.md)** - Phase-by-phase, gate-driven developer checklists (DoR/Artifacts/DoD)

**⚙️ [Technical Implementation](project-documents/02-technical-implementation.md)** - Complete technical specifications, database schemas, code examples, and implementation patterns

**🔮 [Future Considerations](project-documents/additional/03-future-considerations.md)** - Advanced features and technical specifications for future development phases

**🔮 [Additional Data Collection](project-documents/additional/04-additional-data-collection.md)** - Details on additional data collection methods and strategies

- Developer Docs Index: `docs/README.md` (links to handbook, standards, automation, onboarding)

### API Documentation
- **OpenAPI/Swagger**: Interactive API documentation
- **Postman Collections**: Pre-configured API requests
- **Code Examples**: Usage examples in multiple languages

### Developer Documentation
- **Architecture Guide**: System design and patterns (see Technical Implementation)
- **Contributing Guide**: Development workflow and standards
- **Troubleshooting**: Common issues and solutions
- **Performance Guide**: Optimization best practices

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Clone with submodules**: `git clone --recursive <your-fork-url>`
3. **Create** a feature branch
4. **Implement** your changes
5. **Test** thoroughly
6. **Submit** a pull request
7. **Code review** and approval
8. **Merge** to main branch

**Important**: Always clone with `--recursive` flag to include electrs submodule, or run `git submodule init && git submodule update` after cloning.

**electrs Development Setup:**
- electrs runs continuously during development
- Initial indexing (6-24 hours) completed once per environment
- Real-time updates begin automatically after initial indexing
- Your application can start development immediately after initial indexing completes

### Code Standards
- Follow the [Code Standards Guide](docs/code-standard.md)
- Write comprehensive tests
- Update documentation
- Follow commit message conventions
- Ensure all CI checks pass
- Maintain DevOps automation standards
- Follow semantic versioning guidelines

### Future Development
- Review [Future Considerations](project-documents/additional/03-future-considerations.md) for comprehensive technical specifications
- Evaluate implementation complexity against core mission objectives
- Prioritize features based on user value and technical feasibility
- Reference detailed implementation requirements and development timelines

### electrs Submodule Management
```bash
# Update electrs to latest version
git submodule update --remote electrs

# Update electrs to specific version/tag
cd electrs
git checkout <version-tag>
cd ..
git add electrs
git commit -m "Update electrs to version <version-tag>"

# Initialize submodule after fresh clone
git submodule init
git submodule update

# View submodule status
git submodule status
```

---

## 🚨 Troubleshooting

### Common Issues

#### **Installation Problems**
```bash
# Node.js version issues
nvm use 18.17.0

# Permission issues (Linux/Mac)
sudo chown -R $USER:$GROUP ~/.npm

# Clear npm cache
npm cache clean --force
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Reset database connection
npm run db:reset

# Check environment variables
echo $DATABASE_URL
```

#### **Build Failures**
```bash
# Clear build cache
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run typecheck

# Verify dependencies
npm audit
```

#### **Docker Issues**
```bash
# Clean Docker environment
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### **electrs Issues**
```bash
# Check electrs status
sudo systemctl status electrs

# Restart electrs service
sudo systemctl restart electrs

# Check electrs logs
sudo journalctl -u electrs -f

# Check electrs data directory
ls -la /var/lib/electrs
```

### Performance Issues
- **Slow builds**: Check available RAM and CPU
- **Memory leaks**: Monitor with `npm run metrics:view`
- **API timeouts**: Verify database connection pool settings
- **Bundle size**: Use `npm run build:analyze`

---

## 📞 Support and Contact

### Getting Help
- **Documentation**: Check this README and project docs
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Wiki**: Project wiki for detailed guides

### Team Communication
- **Slack**: #blocksight-dev channel
- **Email**: dev@blocksight.live
- **Meetings**: Weekly development sync

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔄 Version History

- **v1.0.0** - Initial release (Planned)
- **v0.9.0** - Beta release (Planned)
- **v0.8.0** - Alpha release (Planned)
- **v0.7.0** - Development phase (Current)

---

**Last Updated**: 2025-08-11  
**Maintainer**: Development Team  
**Status**: In Development

## 🖼️ How to view system diagrams

- These diagrams are written in Mermaid inside Markdown under `project-documents/system-diagrams/`.
- Options to view:
  - VS Code: Install “Markdown Preview Mermaid Support” extension and open Preview.
  - Web: Paste any diagram code block into the Mermaid Live Editor (`https://mermaid.live`) to render.
  - Static docs: MkDocs + `mkdocs-mermaid2-plugin` or Docusaurus with Mermaid enabled.
- Exports (PNG/SVG): We provide a script to export diagrams into `project-documents/system-diagrams/exports/` using the Mermaid CLI.

For authoring/exporting diagrams and the backend initialization plan (Express + ws), see `docs/developer-handbook.md`.

Monorepo structure and scripts
- Root `package.json` orchestrates multi-project workflows (frontend + backend) and dev services. Workspace-level `package.json` files isolate per-surface dependencies and scripts.
- Use root commands for day-to-day: `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test`.
- Use workspace flags to focus: `npm run dev -w backend` or `npm run dev -w frontend`.
