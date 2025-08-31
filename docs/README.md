# 📚 BlockSight Documentation

**Document Type:** Documentation Index  
**Version:** 1.0.0  
**Created:** 2025-08-30  
**Status:** Active Development  
**Last Modified:** 2025-08-30

---

## 🎯 **PURPOSE**

This document serves as the central documentation hub for BlockSight.live, providing comprehensive information about the system architecture, development guidelines, and operational procedures.

---

## 🏗️ **SYSTEM OVERVIEW**

BlockSight.live is a high-performance Bitcoin blockchain analysis platform that provides real-time visualization, analytics, and insights through a modern web application architecture.

### **Core Components**
- **Frontend**: React 18+ application with TypeScript and Vite
- **Backend**: Node.js API with TypeScript and Express
- **Blockchain Integration**: Bitcoin Core + electrs for data access
- **Real-time Updates**: WebSocket-driven live data streaming
- **3D Visualization**: Three.js integration for blockchain exploration

---

## 🚀 **FRONTEND ARCHITECTURE**

### **Technology Stack**
- **Framework**: React 18+ with TypeScript
- **Build System**: Vite for fast development and optimized builds
- **Styling**: CSS Modules + CSS Custom Properties + Styled Components
- **State Management**: Redux for Bitcoin data, React Context for UI state
- **Real-time**: WebSocket integration for live blockchain updates
- **3D Graphics**: Three.js with React Three Fiber (planned)

### **Core Components**
- **Dashboard**: Three-column layout (Search, Blockchain Visualizer, Analytics)
- **Real-time Updates**: WebSocket-driven data refresh every 1-2 seconds
- **Theme System**: Light/Dark/Cosmic themes with dynamic switching
- **Internationalization**: EN/ES/HE/PT languages with RTL support
- **Responsive Design**: Mobile-first approach with advanced breakpoints

### **Current Status**

#### **✅ Completed Features**
- **React Application**: Complete dashboard with three-column layout
- **Style System**: CSS Modules + Custom Properties + Styled Components
- **Theme System**: Light/Dark/Cosmic themes with dynamic switching
- **Internationalization**: EN/ES/HE/PT languages with RTL support
- **WebSocket Integration**: Real-time Bitcoin data connectivity ready
- **Component Architecture**: 15+ components with complete styling
- **Performance Features**: Loading animations, splash screen, 3D design system
- **TypeScript**: 0 compilation errors, strict mode compliance

#### **🎯 Next Phase Goals**
- **ThreeJS Integration**: 3D blockchain visualization in center column
- **Dashboard Widgets**: Enhanced fee, network, and timeline displays
- **Mobile Optimization**: Mobile-specific UI improvements

### **Development Workflow**

#### **Getting Started**
1. **Setup**: Follow the main project README for development environment setup
2. **Frontend Dev**: `cd frontend && npm run dev` for development server
3. **Build**: `npm run build` for production build
4. **Testing**: `npm test` for unit tests

#### **Development Server Configuration**
The frontend development server is configured with Vite and includes API proxy rules for seamless backend integration:

```typescript
// vite.config.ts
server: {
  port: 3000,
  host: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
      // Keeps /api prefix for backend routing
    },
    '/ws': {
      target: 'ws://localhost:8000',
      ws: true
    }
  }
}
```

---

## 🏗️ **INFRASTRUCTURE & DEPLOYMENT**

### **Current Infrastructure Status**

#### **✅ Production Ready**
- **Frontend Staging**: Vercel deployment operational
- **Backend Development**: Local Docker environment
- **Database**: PostgreSQL with Redis caching
- **Monitoring**: Prometheus + Grafana stack
- **CI/CD**: GitHub Actions pipeline

#### **🔄 In Development**
- **Production Backend**: Kubernetes deployment preparation
- **Load Balancing**: Nginx reverse proxy setup
- **Auto-scaling**: Horizontal pod autoscaling
- **Backup Strategy**: Automated database backups

### **Architecture Components**

#### **Frontend Infrastructure**
- **Platform**: Vercel (staging), Kubernetes (production planned)
- **Build System**: Vite with optimized production builds
- **CDN**: Global edge network for static assets
- **Performance**: Lighthouse CI integration for performance monitoring

#### **Backend Infrastructure**
- **Runtime**: Node.js with TypeScript
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes (planned), Docker Compose (development)
- **Scaling**: Horizontal scaling with load balancing

#### **Data Layer**
- **Primary Database**: PostgreSQL for analytics and metadata
- **Cache Layer**: Redis for real-time data and session management
- **Blockchain Data**: Bitcoin Core + electrs for blockchain access
- **Backup Strategy**: Automated daily backups with point-in-time recovery

#### **Network & Security**
- **Load Balancer**: Nginx reverse proxy with SSL termination
- **SSL/TLS**: Let's Encrypt certificates with auto-renewal
- **Security**: WAF, rate limiting, and DDoS protection
- **Monitoring**: Real-time security monitoring and alerting

### **Deployment Environments**

#### **Development Environment**
- **Local Setup**: Docker Compose for full-stack development
- **Database**: Local PostgreSQL with sample data
- **Blockchain**: Bitcoin Core testnet + electrs
- **Hot Reload**: Frontend and backend development servers

#### **Staging Environment**
- **Frontend**: Vercel with automatic deployments from main branch
- **Backend**: Local development environment (to be migrated)
- **Database**: Local PostgreSQL (to be migrated to staging DB)
- **Testing**: Full integration testing and performance validation

#### **Production Environment** (Planned)
- **Platform**: Kubernetes cluster with auto-scaling
- **Database**: Managed PostgreSQL with high availability
- **Monitoring**: Comprehensive observability stack
- **Backup**: Automated disaster recovery procedures

### **Deployment Process**

#### **Frontend Deployment**
1. **Build**: Vite production build with optimization
2. **Test**: Automated testing and quality checks
3. **Deploy**: Vercel automatic deployment from main branch
4. **Validate**: Performance and functionality verification

#### **Backend Deployment** (Planned)
1. **Build**: Docker image creation with multi-stage build
2. **Test**: Integration and performance testing
3. **Deploy**: Kubernetes deployment with rolling updates
4. **Monitor**: Health checks and performance monitoring

---

## 📚 **DOCUMENTATION NAVIGATION**

**Start here**: [Documentation Index](DOCUMENTATION-INDEX.md) - Complete, organized overview of all documentation files and their purposes

## 🚀 **Recommended Reading Order (First Week)**

1. **System Overview**: `project-documents/00-model-spec.md` - Complete system architecture and requirements
2. **Development Standards**: `docs/code-standard.md` - **MANDATORY** - Your development rulebook
3. **Developer Guide**: `docs/developer-handbook.md` - **CRITICAL** - Complete development guide, glossary, and methodologies
4. **Quick Start**: `docs/ENVIRONMENT-SETUP.md` - Environment configuration guide

## 📋 **Core Documentation**

### **Development Standards**
- **`docs/code-standard.md`** - **MANDATORY** - Your single source of truth for development
- **`docs/developer-handbook.md`** - **CRITICAL** - Comprehensive development guide, glossary, and code review standards
- **`docs/API-STANDARDS.md`** - API development standards and response formats
- **`docs/API-ENDPOINTS.md`** - Complete API reference and endpoint documentation

### **Implementation Guides**
- **`docs/middleware-patterns.md`** - Complete middleware architecture and implementation
- **`docs/frontend-bundle-strategy.md`** - Frontend optimization and code splitting
- **`docs/css-quality-standards.md`** - CSS architecture and quality standards
- **`docs/testing-standards-checklist.md`** - Complete testing standards and checklist
- **`docs/frontend/naming-conventions.md`** - **CRITICAL** - Frontend naming standards and API conventions

### **System Architecture**
- **`project-documents/00-model-spec.md`** - System architecture and requirements
- **`project-documents/01-development-roadmap.md`** - Development phases and milestones
- **`project-documents/02-technical-implementation.md`** - Technical specifications and implementation details

### **System Diagrams**
**📊 `project-documents/system-diagrams/` - ALL system architecture diagrams**
- **`01-system-context-diagram.md`** - System boundaries and external integrations
- **`02-component-architecture-diagram.md`** - Component relationships and data flow
- **`03-data-flow-diagram.md`** - Data flow patterns and API interactions
- **`12-testing-architecture-diagram.md`** - Testing patterns and background process management

### **Development Tools**
- **`README.md`** - Single source of truth for commands and setup
- **`project-documents/01-execution-checklists.md`** - Task tracking and completion status
- **`project-documents/FILE_REFACTORING_PLAN.md`** - Future code quality improvement plan

---

## 🔧 **DEVELOPMENT WORKFLOW**

### **Before Starting Development**
1. **Read `docs/code-standard.md`** - Your mandatory development rulebook
2. **Review relevant system diagrams** in `project-documents/system-diagrams/`
3. **Check `project-documents/01-execution-checklists.md`** for current task status
4. **Review `docs/ENVIRONMENT-SETUP.md`** for environment configuration

### **During Development**
1. **Follow code standards** from `docs/code-standard.md`
2. **Implement lazy loading** for heavy components
3. **Follow API standards** if working on API endpoints
4. **Update system diagrams** if architecture changes
5. **Use established styles** from the CSS system

### **Before Committing**
1. **Run all tests** and ensure they pass
2. **Check TypeScript compilation** with `npm run typecheck`
3. **Verify linting** with `npm run lint`
4. **Update documentation** if functionality changes
5. **Check performance impact** of changes

---

## 🎯 **QUICK REFERENCE**

### **Essential Commands**
```bash
# Development
npm run dev                    # Start development server
npm run build                 # Build for production
npm test                      # Run all tests
npm run typecheck            # TypeScript compilation check
npm run lint                 # Linting check

# Docker
docker-compose -f docker-compose.dev.yml up    # Start development environment
docker-compose -f docker-compose.dev.yml down  # Stop development environment
```

### **Key Files**
- **`docs/code-standard.md`** - Development rulebook (MANDATORY)
- **`project-documents/00-model-spec.md`** - System architecture
- **`docs/ENVIRONMENT-SETUP.md`** - Environment configuration
- **`docs/DOCUMENTATION-INDEX.md`** - Complete documentation reference

---

## 💡 **REMEMBER**

- **`docs/code-standard.md`** is your MANDATORY development rulebook
- **`project-documents/system-diagrams/`** contains ALL system architecture diagrams
- **No duplicate documentation** - each topic has ONE authoritative document
- **Update diagrams** when architecture changes
- **Keep documentation lean** and focused on actionable information

---

**Last Updated**: 2025-08-30
**Version**: 1.0.0
**Status**: Active Development
