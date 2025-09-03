# 📚 BlockSight Documentation Index

## 🎯 **QUICK START FOR DEVELOPERS**
**Before ANY development work, read these 3 files:**
1. **`docs/code-standard.md`** - Your development rulebook (MANDATORY)
2. **`project-documents/00-model-spec.md`** - System architecture and requirements
3. **`project-documents/system-diagrams/`** - All system architecture diagrams

---

## 📋 **CORE DOCUMENTATION**
### **Development Rulebook**
- **`docs/code-standard.md`** - **MANDATORY** - Your single source of truth for development

### **Developer Guidance**
- **`docs/developer-handbook.md`** - **CRITICAL** - Comprehensive development guide, glossary, methodologies, and code review standards

### **System Architecture**
- **`project-documents/00-model-spec.md`** - Complete system architecture and requirements
- **`project-documents/01-development-roadmap.md`** - Development phases and milestones
- **`project-documents/02-technical-implementation.md`** - Technical specifications and implementation details

### **Project Management**
- **`project-documents/01-execution-checklists.md`** - Task tracking and completion status
- **`project-documents/FUTURE-PLANNING-CONSOLIDATED.md`** - Long-term roadmap and features
- **`project-documents/FILE_REFACTORING_PLAN.md`** - Future code quality improvement plan

---

## 🏗️ **IMPLEMENTATION GUIDES**
### **Frontend Development**
- **`docs/frontend-bundle-strategy.md`** - Bundle optimization and code splitting
- **`docs/css-quality-standards.md`** - Complete CSS architecture, design tokens, and 3D design system
- **`docs/frontend/naming-conventions.md`** - **CRITICAL** - Frontend naming standards and API conventions

### **Backend Development**
- **`docs/API-STANDARDS.md`** - API development standards and adapter implementation status
- **`docs/API-ENDPOINTS.md`** - Complete API reference and endpoint documentation
- **`docs/middleware-patterns.md`** - Complete middleware architecture and implementation

### **Testing & Quality**
- **`docs/testing-standards-checklist.md`** - Complete testing standards, checklist, and test suite documentation
- **`docs/ERROR_HANDLING_GUIDE.md`** - **CRITICAL** - Comprehensive error handling patterns, boundaries, and graceful degradation
- **`docs/ENVIRONMENT-SETUP.md`** - Comprehensive environment configuration guide

### **Infrastructure & DevOps**
- **`docs/infrastructure/docker.md`** - Docker configuration and container management

---

## 📊 **SYSTEM DIAGRAMS**
**Location: `project-documents/system-diagrams/`**
### **Core Architecture**
- **`01-system-context-diagram.md`** - System boundaries and external integrations
- **`02-component-architecture-diagram.md`** - Component relationships and data flow
- **`03-data-flow-diagram.md`** - Data flow patterns and API interactions

### **Technical Implementation**
- **`04-sequence-diagrams.md`** - Sequence flows and interactions
- **`05-class-diagrams.md`** - Class relationships and structure
- **`06-deployment-diagram.md`** - Deployment architecture
- **`07-activity-tip-and-mempool.md`** - Activity and mempool flows
- **`08-state-circuit-breaker.md`** - Circuit breaker patterns
- **`09-component-electrum-adapter.md`** - Electrum adapter details
- **`10-use-case-diagram.md`** - Use case scenarios
- **`11-package-diagram.md`** - Package structure

### **Testing & Quality**
- **`12-testing-architecture-diagram.md`** - Testing patterns and background process management

---

## 🔄 **FUTURE PLANNING**
- **`project-documents/FUTURE-PLANNING-CONSOLIDATED.md`** - Long-term roadmap and features
- **`project-documents/FILE_REFACTORING_PLAN.md`** - Strategic plan for code quality improvements
- **`project-documents/THREEJS_IMPLEMENTATION_PLAN.md`** - 3D visualization implementation roadmap

---

## 🚀 **DEVELOPMENT WORKFLOW**
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

### **Quality Gates**
- **TypeScript**: 0 compilation errors
- **Linting**: All rules passing
- **Tests**: All tests passing
- **Build**: Successful compilation
- **Performance**: Meets established thresholds

---

## 📝 **DOCUMENTATION MAINTENANCE**
### **File Organization Rules**
- **System Diagrams**: ALL go in `project-documents/system-diagrams/`
- **Implementation Guides**: Go in `docs/` folder
- **Project Documents**: Go in `project-documents/` folder
- **No Duplication**: Each topic has ONE authoritative document

### **Consolidation Status**
- **✅ Frontend Style Documentation**: Consolidated into `docs/css-quality-standards.md`
- **✅ Backend Adapter Documentation**: Consolidated into `docs/API-STANDARDS.md`
- **✅ Test Documentation**: Consolidated into `docs/testing-standards-checklist.md`
- **✅ README Files**: Consolidated into `docs/README.md`
- **✅ Redundant Files**: Removed 8+ redundant documentation files
- **✅ Developer Handbook**: Now properly referenced in main documentation structure

### **Current Structure**
- **47 markdown files** (down from 60+)
- **Single source of truth** for each topic
- **Streamlined navigation** through `docs/README.md`
- **Consolidated implementation guides** in `docs/` folder
- **Critical developer guidance** properly accessible

---

## 🔍 **QUICK REFERENCE**
### **For New Developers**
1. **`docs/code-standard.md`** - Development rulebook
2. **`docs/developer-handbook.md`** - **CRITICAL** - Complete development guide and glossary
3. **`docs/README.md`** - Complete system overview
4. **`docs/ENVIRONMENT-SETUP.md`** - Environment setup

### **For Frontend Development**
1. **`docs/css-quality-standards.md`** - CSS architecture and design system
2. **`docs/frontend-bundle-strategy.md`** - Performance optimization
3. **`docs/frontend/naming-conventions.md`** - **CRITICAL** - Naming standards and API conventions

### **For Backend Development**
1. **`docs/API-STANDARDS.md`** - API development standards
2. **`docs/middleware-patterns.md`** - Middleware architecture

### **For Testing**
1. **`docs/testing-standards-checklist.md`** - Complete testing guide
2. **`docs/ERROR_HANDLING_GUIDE.md`** - **CRITICAL** - Error handling patterns and boundaries
3. **`project-documents/system-diagrams/12-testing-architecture-diagram.md`** - Testing patterns

---

## 💡 **REMEMBER**
- **`docs/code-standard.md`** is your MANDATORY development rulebook
- **`docs/developer-handbook.md`** is your **CRITICAL** development guide and glossary
- **`project-documents/system-diagrams/`** contains ALL system architecture diagrams
- **No duplicate documentation** - each topic has ONE authoritative source
- **Update diagrams** when architecture changes
- **Keep documentation lean** and focused on actionable information

---

**Last Updated**: 2025-08-30
**Version**: 1.0.0
**Status**: Consolidated and Optimized
