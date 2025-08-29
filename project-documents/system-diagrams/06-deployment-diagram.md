# BlockSight.live - Deployment Diagram

/**
 * @fileoverview Deployment diagram showing the infrastructure and deployment architecture of BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This diagram shows the deployment architecture of BlockSight.live, including Vercel staging,
 * local development environment, and production infrastructure. It reflects our current
 * implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding deployment architecture and infrastructure
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add production deployment details when implemented
 * - Update with new infrastructure as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows deployment optimization strategies
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This Deployment Diagram shows the infrastructure and deployment architecture of BlockSight.live, including Vercel staging, local development environment, and production infrastructure. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              STAGING ENVIRONMENT                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐ │ │
│  │  │     Vercel      │    │   Edge Network  │    │   Global CDN            │ │ │
│  │  │                 │    │                 │    │                         │ │ │
│  │  │                 │    │                 │    │                         │ │ │
│  │  │ • Frontend      │    │ • Washington DC │    │ • Static Assets         │ │ │
│  │  │   Deployment    │    │   (iad1)        │    │ • Build Optimization    │ │ │
│  │  │ • Auto-deploy   │    │ • 2 Cores       │    │ • Performance           │ │ │
│  │  │ • Build System  │    │ • 8 GB RAM      │    │   Monitoring            │ │ │
│  │  │ • Environment   │    │ • Fast Build    │    │ • Analytics             │ │ │
│  │  │   Variables     │    │ • Cache         │    │ • Edge Functions        │ │ │
│  │  │ • Domain Mgmt   │    │   Optimization  │    │ • Serverless            │ │ │
│  │  │ • SSL/TLS       │    │ • Load          │    │   Computing             │ │ │
│  │  │   Security      │    │   Balancing     │    │ • Auto-scaling          │ │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            LOCAL DEVELOPMENT                               │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Docker        │    │   Development   │    │   Build Tools          │  │ │
│  │  │   Compose       │    │   Environment   │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • electrs       │    │ • Node.js       │    │ • Vite Dev Server      │  │ │
│  │  │   Container     │    │   Backend       │    │ • Hot Module           │  │ │
│  │  │ • Redis         │    │ • TypeScript    │    │   Replacement          │  │ │
│  │  │   Container     │    │   Compilation   │    │ • Fast Refresh         │  │ │
│  │  │ • PostgreSQL    │    │ • ESLint        │    │ • Bundle Analysis      │  │ │
│  │  │   Container     │    │   Linting       │    │ • Performance          │  │ │
│  │  │ • Network       │    │ • Jest Testing  │    │   Profiling            │  │ │
│  │  │   Isolation     │    │ • Hot Reload    │    │ • Type Checking        │  │ │
│  │  │ • Volume        │    │ • Debug Mode    │    │ • Source Maps          │  │ │
│  │  │   Mounting      │    │ • Environment   │    │ • Error Overlay        │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              CI/CD PIPELINE                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   GitHub        │    │   GitHub        │    │   Deployment           │  │ │
│  │  │   Actions       │    │   Repository    │    │   Triggers             │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Automated     │    │ • Main Branch   │    │ • Push to Main         │  │ │
│  │  │   Testing       │    │ • Feature       │    │ • Auto-deploy          │  │ │
│  │  │ • Type          │    │   Branches      │    │   Staging              │  │ │
│  │  │   Checking      │    │ • Pull          │    │ • Build Verification   │  │ │
│  │  │ • Linting       │    │   Requests      │    │ • Test Results         │  │ │
│  │  │ • Build         │    │ • Code Review   │    │ • Quality Gates        │  │ │
│  │  │   Verification  │    │ • Merge         │    │ • Security             │  │ │
│  │  │ • Security      │    │   Protection    │    │   Scanning             │  │ │
│  │  │   Scanning      │    │ • Branch        │    │ • Dependency           │  │ │
│  │  │ • Dependency    │    │   Policies      │    │   Updates              │  │ │
│  │  │   Updates       │    │ • Version       │    │ • Release              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            MONITORING STACK                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Prometheus    │    │     Grafana     │    │       Logging          │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Metrics       │    │ • Dashboards    │    │ • Structured Logs      │  │ │
│  │  │   Collection    │    │ • Visualization │    │ • Error Tracking       │  │ │
│  │  │ • Performance   │    │ • Alerting      │    │ • Performance          │  │ │
│  │  │   Data          │    │ • Real-time     │    │   Monitoring           │  │ │
│  │  │ • Health        │    │   Monitoring    │    │ • Audit Trail          │  │ │
│  │  │   Checks        │    │ • Custom        │    │ • Debug Info           │  │ │
│  │  │ • Custom        │    │   Metrics       │    │ • Security Events      │  │ │
│  │  │   Metrics       │    │ • Historical    │    │ • System Health        │  │ │
│  │  │ • Alerting      │    │ • Data          │    │ • Log Aggregation      │  │ │
│  │  │ • Data          │    │   Export        │    │ • Centralized          │  │ │
│  │  │   Retention     │    │ • API Access    │    │   Storage              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Deployment Environments

### Staging Environment ✅ **IMPLEMENTED**
- **Platform**: Vercel with global edge network
- **Location**: Washington DC (iad1) with 2 cores, 8 GB RAM
- **Features**: Auto-deploy, build optimization, SSL/TLS security
- **Performance**: Fast builds, cache optimization, load balancing
- **Monitoring**: Built-in analytics and performance monitoring

### Local Development Environment ✅ **IMPLEMENTED**
- **Containerization**: Docker Compose with service isolation
- **Services**: electrs, Redis, PostgreSQL containers
- **Development Tools**: Vite dev server, hot reload, TypeScript compilation
- **Testing**: Jest testing framework with hot reload
- **Debugging**: Source maps, error overlay, environment variables

### CI/CD Pipeline ✅ **IMPLEMENTED**
- **Automation**: GitHub Actions with automated workflows
- **Quality Gates**: Type checking, linting, testing, security scanning
- **Deployment**: Auto-deploy to staging on main branch pushes
- **Security**: Dependency updates, vulnerability scanning
- **Monitoring**: Build verification and test result reporting

### Monitoring Stack ✅ **IMPLEMENTED**
- **Metrics**: Prometheus for data collection and alerting
- **Visualization**: Grafana dashboards with real-time monitoring
- **Logging**: Structured logging with centralized storage
- **Alerting**: Performance monitoring and security event tracking

## Deployment Characteristics

### Performance Optimization ✅ **IMPLEMENTED**
- **Edge Computing**: Global CDN with edge functions
- **Build Optimization**: Vite build system with code splitting
- **Caching**: Multi-tier caching strategy (Redis L1, Memory-mapped L2)
- **Auto-scaling**: Serverless computing with automatic scaling

### Security Features ✅ **IMPLEMENTED**
- **SSL/TLS**: Encrypted communication with security headers
- **Container Isolation**: Docker-based service isolation
- **Security Scanning**: Automated vulnerability detection
- **Access Control**: GitHub branch protection and code review

### Reliability Features ✅ **IMPLEMENTED**
- **Auto-deploy**: Continuous deployment with build verification
- **Health Checks**: Comprehensive monitoring and alerting
- **Failover**: Load balancing and connection pooling
- **Backup**: Data persistence with volume mounting

## Current Implementation Status

### ✅ **COMPLETED DEPLOYMENTS**
- **Staging**: Vercel frontend deployment with global CDN
- **Local Development**: Docker-based environment with all services
- **CI/CD**: GitHub Actions automation with quality gates
- **Monitoring**: Prometheus, Grafana, and structured logging
- **Performance**: All targets achieved, ready for production

### 🎯 **NEXT PHASE GOALS**
- **Production Deployment**: Production infrastructure setup
- **Advanced Monitoring**: Enhanced alerting and performance tracking
- **Global Scaling**: Multi-region deployment optimization
- **Disaster Recovery**: Backup and recovery procedures

