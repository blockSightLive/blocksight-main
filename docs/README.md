# Developer Docs Index

Use this index to find what you need fast.

## 📚 Documentation Navigation

**Start here**: [Documentation Navigation Guide](DOCUMENTATION-NAVIGATION.md) - Complete overview of all documentation files and their purposes

## 🚀 **Recommended Reading Order (First Week)**

1. **`README.md`** (root): Project overview and CI/CD summary
2. **`docs/developer-handbook.md`**: Complete development workflow and guidelines
3. **`docs/code-standard.md`**: Development standards and rules
4. **`project-documents/00-model-spec.md`**: What we're building and why
5. **`docs/ENVIRONMENT-SETUP.md`**: Environment setup and configuration
6. **`project-documents/system-diagrams/*`**: Visualize the architecture

## 🎯 **Purpose-Based Navigation**

### **Getting Started**
- **Complete Development Guide**: [docs/developer-handbook.md](developer-handbook.md) - Development workflow, tooling, and best practices
- **Environment Setup**: [docs/ENVIRONMENT-SETUP.md](ENVIRONMENT-SETUP.md) - Comprehensive environment configuration
- **Development Standards**: [docs/code-standard.md](code-standard.md) - Programming standards and quality metrics

### **API Development**
- **API Reference**: [docs/API-ENDPOINTS.md](API-ENDPOINTS.md) - Complete endpoint documentation
- **API Standards**: [docs/API-STANDARDS.md](API-STANDARDS.md) - Development standards and best practices
- **API Navigation**: [docs/API-NAVIGATION.md](API-NAVIGATION.md) - Quick API development guide

### **Frontend Development**
- **Frontend Guide**: [docs/frontend/README.md](frontend/README.md) - Complete frontend documentation
- **Naming Conventions**: [docs/frontend/naming-conventions.md](frontend/naming-conventions.md) - **CRITICAL** - Single source of truth
- **Styling Guide**: [docs/frontend/styles-README.md](frontend/styles-README.md) - CSS architecture and theming

### **Infrastructure & Deployment**
- **Infrastructure Overview**: [docs/infrastructure/README.md](infrastructure/README.md) - Infrastructure architecture
- **Docker Configuration**: [docs/infrastructure/docker.md](infrastructure/docker.md) - Container setup and management

### **Architecture & Planning**
- **System Architecture**: [project-documents/00-model-spec.md](../project-documents/00-model-spec.md) - System requirements and design
- **Development Roadmap**: [project-documents/01-development-roadmap.md](../project-documents/01-development-roadmap.md) - Strategic development plan
- **Execution Checklists**: [project-documents/01-execution-checklists.md](../project-documents/01-execution-checklists.md) - Phase-by-phase tasks
- **System Diagrams**: [project-documents/system-diagrams/](../project-documents/system-diagrams/) - Visual architecture representation

## 🛠️ **Development Tools & Standards**

- **Testing Stack**: Jest + ts-jest + supertest (backend); wired in CI
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Containerization**: Docker-first development with `docker-compose.dev.yml`
- **CI/CD**: Automated testing, type checking, and deployment

## 📋 **Quick Reference**

### **For New Developers**
1. **Start**: `docs/developer-handbook.md` → `docs/ENVIRONMENT-SETUP.md`
2. **Understand**: `project-documents/00-model-spec.md`
3. **Learn Standards**: `docs/code-standard.md`

### **For API Development**
1. **Standards**: `docs/API-STANDARDS.md`
2. **Reference**: `docs/API-ENDPOINTS.md`
3. **Quick Start**: `docs/API-NAVIGATION.md`

### **For Frontend Development**
1. **Guide**: `docs/frontend/README.md`
2. **Naming**: `docs/frontend/naming-conventions.md`
3. **Styling**: `docs/frontend/styles-README.md`

## 💡 **Tips**

- **Prefer diagrams-first** for non-trivial changes. Update diagrams and specs alongside code.
- **Never hardcode UI strings**; follow i18n rules in the developer handbook.
- **Keep PRs small**; run typecheck/lint/tests locally before push.
- **Containers-first**: After installs, prefer running via `docker-compose -f docker-compose.dev.yml up -d --build`

## 🔄 **Recent Documentation Updates**

### **✅ New Documents Created**
- **`docs/ENVIRONMENT-SETUP.md`** - Comprehensive environment configuration guide
- **`docs/API-NAVIGATION.md`** - API development navigation guide
- **`docs/MIDDLEWARE-DEVELOPER-GUIDE.md`** - Complete middleware architecture and development guide

### **✅ Documents Enhanced**
- **`docs/code-standard.md`** - Optimized and enhanced development rulebook
- **`docs/API-ENDPOINTS.md`** - Added new endpoints and features
- **`docs/API-STANDARDS.md`** - Updated with new standards

### **🗑️ Documents Consolidated**
- **`docs/install-notes.md`** → Superseded by `ENVIRONMENT-SETUP.md`
- **`docs/onboarding.md`** → Consolidated into `developer-handbook.md`

---

**Last Updated**: 2025-08-30  
**Status**: ✅ **CURRENT** - Documentation consolidated and optimized
