# 🚀 High-Performance Code Standards - Development Rulebook

## Purpose
**Purpose:** Single source of truth for high-quality, high-performance code development  
**Audience:** Lead software engineer  
**Usage:** Review before every coding session and during code reviews  
**Version:** 1.0.0  
**Last Updated:** 2025-08-30  
**Level:** Expert/Production-Ready

**Core Responsibility:** I am the software engineer of this system and it is my sole responsibility that it works fully as stated by the Model Spec file.

---

## 🎯 Core Principles

### Programming Paradigms
- **Functional** for data transformations and pure calculations
- **OOP** for stateful entities and natural inheritance
- **Hybrid** when both complement each other

### Design Patterns Priority
1. **Factory Pattern** - Complex object creation
2. **Builder Pattern** - Step-by-step construction
3. **Strategy Pattern** - Interchangeable algorithms
4. **Observer Pattern** - Events and notifications
5. **Singleton Pattern** - Unique resources (use carefully)
6. **Abstract Factory** - Related object families

### **🚨 MANDATORY DEVELOPMENT REQUIREMENTS (CRITICAL)**

**Before ANY development work, I MUST:**

1. **🔒 NEVER RUN TERMINAL COMMANDS MYSELF** - I request commands to be run manually
2. **📱 Lazy Loading Implementation** - Always implement lazy loading for heavy components
3. **🌐 API Standards Compliance** - Follow `docs/API-STANDARDS.md` and `docs/API-ENDPOINTS.md`
4. **📊 System Diagrams Review** - Update relevant diagrams in `project-documents/system-diagrams/`
5. **🎨 Styles Library Usage** - Use established styles from `frontend/src/styles/` system

**These requirements are NON-NEGOTIABLE and apply to every development session.**

---

## 🔷 Axioms (operate by default)
- Correctness before performance; never trade consensus safety for speed
- Small, reversible changes; one logical change per PR; fast review cycles
- Tests define behavior; critical paths use TDD where feasible
- Automate repeatable work; measure to improve (DORA, P50/P95/P99)
- Fail safely: timeouts, retries, circuit breakers, rollbacks designed first
- Single source of truth for commands/processes is `README.md`

---

## ⏱️ 5‑Minute Pre‑Flight (MANDATORY)

### Documentation Review
- Read `project-documents/00-model-spec.md`, roadmap, and `01-execution-checklists.md`
- **MANDATORY API REVIEW**: For any API work, read `docs/API-ENDPOINTS.md` and `docs/API-STANDARDS.md`
- **MANDATORY SYSTEM DIAGRAM REVIEW**: For any API changes, review and update relevant system diagrams

### Task Planning
- Define scope, assumptions, constraints, and acceptance criteria
- Choose paradigm/patterns; declare SLO/budget impact (latency/memory)
- Plan tests (unit/integration/contract/E2E) and data fixtures
- Confirm batching: can I finish in one edit (max two) per file?
- Cross-check system intent: review `project-documents/system-diagrams/*` to verify module boundaries, data flows, and responsibilities

---

## ✅ Definition of Ready / ✅ Definition of Done
- **DoR:** Issue linked; design/pattern chosen; test plan; budgets; risks noted
- **DoD:** Code + tests + docs updated; gates pass (lint/type/test/sec/perf); no breadcrumbs; README alignment checked

---

## 🧹 Code Cleanliness Rules

### Eliminate Breadcrumbs
I never leave:
- Unused imports
- Declared but unused variables
- Empty or unimplemented functions
- Debug console.log statements
- TODO comments without dates

### Systematic Development
I always:
1. Identify all affected files
2. Implement changes across all necessary levels
3. Update types, interfaces, and tests
4. Verify complete integration
5. Document changes in all files

I never:
- Make partial changes
- Leave incomplete implementations
- Leave files unupdated

---

## 📝 File Header Structure

Every file I create must have this header:

```typescript
/**
 * @fileoverview [Clear description of file responsibility]
 * @version [X.Y.Z]
 * @author [My name]
 * @since [YYYY-MM-DD]
 * @lastModified [YYYY-MM-DD]
 * 
 * @description
 * [Detailed explanation of what this file does]
 * 
 * @dependencies
 * - [List of critical dependencies]
 * 
 * @usage
 * [Basic usage example]
 * 
 * @state
 * ✅ [Current state: Functional, In Development, Known Bug]
 * 
 * @bugs
 * - [List of known bugs or limitations]
 * 
 * @todo
 * - [Pending tasks with priority]
 * - [Future improvements]
 * 
 * @performance
 * - [Critical performance notes]
 * 
 * @security
 * - [Security considerations]
 */
```

---

## ⚡ State & Error Management

### Mandatory Error Handling
I implement this pattern for all critical operations:

```typescript
try {
  const result = await criticalOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Critical operation failed:', error);
  return { 
    success: false, 
    error: error.message,
    fallback: getFallbackData()
  };
}
```

### Loading States
I always implement:
- `isLoading` state
- `error` state
- Loading spinners and error messages

### Reliability Patterns
- Timeouts on all I/O; retries with jitter; bounded queues; backpressure
- Idempotency for mutating endpoints and background jobs
- Concurrency: avoid shared mutable state; prefer immutability and message passing
- Feature flags for risky paths; kill‑switches available

---

## 🔒 Code Integrity Rules

### Functionality Preservation
Before any change, I:
1. Verify existing tests
2. Document current functionality
3. Create regression tests
4. Implement changes incrementally
5. Verify nothing breaks

### Security Essentials (always)
- Validate and sanitize inputs; deny by default; least privilege
- Secrets never in code; use env/secrets manager; rotate regularly
- SBOM + dependency and license scanning; pin submodule commits
- OWASP Top 10 awareness; SSRF/SQLi/XSS/CSRF mitigations where relevant

---

## 🚨 CRITICAL GIT WORKFLOW PROTECTION (MANDATORY)

**I MUST check Git status before ANY development work:**

**Before Every Development Session:**
1. **Confirm current branch** - Are you on the correct feature branch?
2. **Check remote sync** - Is your local branch up-to-date with remote?
3. **Verify recent commits** - Are your latest changes committed locally?

**During Development:**
- **Commit frequently** - Every logical change should be committed
- **Push to remote** - Push to your feature branch after every 2-3 commits
- **Never lose progress** - Remote branch is your backup

**Git Commands to Run Frequently:**
```bash
git status                    # Check current state
git add . && git commit -m "description"  # Commit changes
git push origin <branch>     # Push to remote
git log --oneline -5         # Verify recent commits
```

**REMINDER**: I will ask for Git status before proceeding with any development work.

---

## 🔧 Development Workflow

### Systematic File Editing
My methodology:
1. **Analyze complete file before editing**
2. **Plan ALL necessary changes** - Reason whether I can batch everything into ONE SINGLE EDIT per file
3. **Edit file ONCE** - Maximum 2 edits per file if absolutely necessary
4. **Save missing items in memory** - If I can't complete everything in 1-2 edits, remember for next response
5. **Verify errors immediately**
6. **Integrate with related files**
7. **Update documentation**

**Critical Rule**: I must reason about batching edits before touching any file. If I can't complete everything in 1-2 edits maximum, I save the remaining work in memory for the next response rather than making multiple small edits.

### File Placement and Responsibility Grouping (CRITICAL)
- **ALWAYS place new files alongside files with similar responsibility** - never create files randomly throughout the codebase
- **Use folder names as guidance** - if you need to find where similar files are located, use `grep` to search folder names and existing file patterns
- **Group by responsibility, not by type** - e.g., all Bitcoin Core setup docs go together, all electrs docs go together, all system diagrams go together
- If a new location is chosen (e.g., `docs/` for developer guides), move older files to align and update all references.
- Keep diagrams and documentation references up to date whenever files move.
- Root should remain lean (e.g., `README.md` as entry point). Consolidate developer guides under `docs/`.

### Runtime Standardization (Containers First)
- Prefer Docker images as the authoritative runtime specification (OS, Node, tools).
- `.nvmrc` is advisory only; Dockerfile/compose define the canonical versions.
- Provide a single, multi-stage Dockerfile at repo root building backend and frontend artifacts.
- Use `docker-compose.dev.yml` to orchestrate dev services (e.g., Redis) and run the backend.

---

## 🏗️ Architecture & Patterns

### **MANDATORY API DEVELOPMENT STANDARDS**
**Before ANY API work, I MUST:**

1. **Read API Documentation**: `docs/API-ENDPOINTS.md` and `docs/API-STANDARDS.md`
2. **Follow Response Format**: Use standardized `{ ok: boolean, data: T, timestamp: number }` structure
3. **Implement Error Handling**: Use `docs/API-STANDARDS.md` error codes and formats
4. **Add Input Validation**: Implement Zod schemas for all endpoints
5. **Update System Diagrams**: Ensure diagrams reflect current API structure
6. **Document Changes**: Update API documentation for any new endpoints
7. **Update Model-Spec**: Ensure `project-documents/00-model-spec.md` reflects current API structure

**API Response Standards (MANDATORY):**
```typescript
// Success Response
interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
  timestamp: number;
}

// Error Response  
interface ApiErrorResponse {
  ok: false;
  error: string;
  message: string;
  timestamp: number;
}
```

**API Endpoint Naming (MANDATORY):**
- Use `/api/v1/{service}/*` pattern
- Service names: `electrum`, `core`, `network`, `ws`
- Resource names: kebab-case (e.g., `/network/height`)

**API Documentation Standards (MANDATORY):**
- All new endpoints must be documented in `docs/API-ENDPOINTS.md`
- All API standards must be updated in `docs/API-STANDARDS.md`
- All system diagrams must reflect current API structure
- All API changes must be reflected in `project-documents/00-model-spec.md`

### **🔧 MIDDLEWARE ARCHITECTURE (MANDATORY)**

**Middleware Stack Order (CRITICAL):**
1. **Request ID Generation** - `errorHandler.requestId`
2. **Metrics Collection** - `MetricsMiddleware.collect`
3. **Security Headers** - `SecurityMiddleware.comprehensive`
4. **Rate Limiting** - `globalRateLimit` + service-specific limits
5. **Body Parsing** - `express.json()`, `express.urlencoded()`
6. **Request Validation** - Zod schemas via `ValidationMiddleware`
7. **Route Handlers** - Controllers and business logic
8. **Error Handling** - `errorHandler.middleware`
9. **404 Handler** - `errorHandler.notFound`

**Required Middleware for All Endpoints:**
```typescript
// Apply to all routes
app.use(errorHandler.requestId);           // Request tracking
app.use(MetricsMiddleware.collect);        // Performance metrics
app.use(SecurityMiddleware.comprehensive); // Security headers
app.use(globalRateLimit);                  // Global rate limiting

// Apply to specific route groups
app.use('/api/v1/health', healthRateLimit);
app.use('/api/v1/electrum', publicRateLimit);
app.use('/api/v1/core', coreRateLimit);
```

**Validation Middleware (MANDATORY):**
- **Use Zod schemas** for all request validation
- **Common schemas** available in `ValidationMiddleware.CommonSchemas`
- **Service-specific schemas** in respective middleware files
- **Apply validation** before route handlers

```typescript
// Example: Apply validation to route
app.get('/api/v1/electrum/address/:address', 
  ValidationMiddleware.validateParams(ElectrumSchemas.getBalance),
  electrumController.getBalance
);
```

**Error Handling Middleware (MANDATORY):**
- **Standardized error responses** via `ApiErrorResponse` interface
- **Request ID tracking** for debugging and correlation
- **Proper HTTP status codes** via `ERROR_STATUS_CODES`
- **Async error wrapping** via `asyncErrorWrapper`

**Monitoring & Metrics (MANDATORY):**
- **Performance tracking** via `MetricsMiddleware.collect`
- **Prometheus metrics** available at `/metrics`
- **Health monitoring** at `/api/v1/metrics/health`
- **Cache statistics** at `/api/v1/cache/stats`

**Security Middleware (MANDATORY):**
- **CORS configuration** via `SecurityMiddleware.cors`
- **Security headers** via `SecurityMiddleware.helmet`
- **Request sanitization** via `SecurityMiddleware.sanitization`
- **Input validation** via `SecurityMiddleware.validation`

**Caching Middleware (OPTIONAL):**
- **Redis integration** via `CacheMiddleware`
- **TTL management** (L1: 1-5s, L2: 1-5min, L3: 1-5hr)
- **Cache invalidation** via `/api/v1/cache/*` endpoints
- **Graceful degradation** when Redis unavailable

### **📊 MONITORING & OBSERVABILITY (MANDATORY)**

**Available Monitoring Endpoints:**
- **`/metrics`** - Prometheus-compatible metrics export
- **`/api/v1/metrics/health`** - System health status
- **`/api/v1/cache/stats`** - Cache performance metrics
- **`/api/v1/cache/invalidate/:service`** - Cache invalidation
- **`/api/v1/cache/invalidate-all`** - Full cache clear

**Metrics Collection (AUTOMATIC):**
- **Response times** - P50, P95, P99 latencies
- **Request counts** - Total requests, errors, cache hits/misses
- **System health** - Uptime, memory usage, Redis status
- **WebSocket metrics** - Connection counts, broadcast latencies

**Developer Access to Monitoring:**
```bash
# View Prometheus metrics
curl http://localhost:8000/metrics

# Check system health
curl http://localhost:8000/api/v1/metrics/health

# View cache statistics
curl http://localhost:8000/api/v1/cache/stats

# Invalidate cache for specific service
curl -X POST http://localhost:8000/api/v1/cache/invalidate/electrum
```

**Performance Budgets (MANDATORY):**
- **API Response Time**: P95 < 200ms (cached), P95 < 1000ms (uncached)
- **Cache Hit Rate**: > 80% for read-heavy endpoints
- **Error Rate**: < 1% for all endpoints
- **Memory Usage**: < 512MB for backend process

### **🔄 MIDDLEWARE DEVELOPMENT PATTERNS**

**Creating New Middleware:**
1. **Follow naming convention**: `{purpose}.middleware.ts`
2. **Export from index**: Add to `backend/src/middleware/index.ts`
3. **Apply in app.ts**: Add to middleware stack in correct order
4. **Add tests**: Create tests in `backend/tests/middleware.test.ts`
5. **Update documentation**: Document in this section and API docs

**Middleware Testing (MANDATORY):**
```typescript
// Test middleware in isolation
describe('Validation Middleware', () => {
  it('should validate request parameters', async () => {
    const app = createTestApp();
    app.use(ValidationMiddleware.validateParams(CommonSchemas.bitcoinAddress));
    // Test validation logic
  });
});
```

**Middleware Integration (MANDATORY):**
- **Test middleware stack** in integration tests
- **Verify order** of middleware application
- **Test error handling** and fallback behavior
- **Validate performance** impact of middleware

### **Modern React Patterns**
I use:
- Custom hooks with optimizations
- Memoization for expensive calculations
- Debouncing with cleanup
- Error boundaries
- Suspense and concurrent features
- Server components when appropriate

### Advanced TypeScript
I implement:
- Strict types with validation
- Utility types and conditional types
- Template literal types
- Mapped types with transformations
- Branded types for type safety
- Discriminated unions

### Observability
- Structured logs with correlation/request IDs; no PII in logs
- Useful log levels (debug/info/warn/error); no noisy loops
- Tracing spans around external calls; propagate context across services

---

## 📊 Quality Metrics

### Required Coverage
- **Unit Tests:** ≥ 85%
- **Integration Tests:** All critical flows
- **E2E Tests:** Main user flows
- **Contract Tests:** 100% of documented APIs
- **Performance Tests:** All critical components
- **Accessibility Tests:** WCAG 2.1 AA compliance

### Performance Targets
- **Bundle Size:** < 1MB
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms
- **Time to Interactive:** < 3s
- **Lighthouse Score:** ≥ 90

### Code Quality
- **Complexity:** ≤ 10 per function
- **Lines per function:** ≤ 50
- **Nesting depth:** ≤ 4 levels
- **Cognitive complexity:** ≤ 15
- **Maintainability index:** ≥ 65
- **Technical debt ratio:** ≤ 5%

---

## 🔄 Development Workflow

### Before Writing Code
1. Review this guide
2. Understand file context
3. Plan implementation
4. Verify dependencies
5. Architecture alignment: confirm the change matches `00-model-spec.md` scope and current diagrams; identify any diagram/doc updates required
6. **🔒 MANDATORY CHECKS**:
   - [ ] **Terminal Commands**: I will NOT run commands myself
   - [ ] **Lazy Loading**: Plan lazy loading for heavy components
   - [ ] **API Standards**: Review `docs/API-STANDARDS.md` if API work
   - [ ] **System Diagrams**: Identify diagram updates needed
   - [ ] **Styles Library**: Plan to use established styles system

### During Development
1. Follow established patterns
2. Implement error handling
3. Write tests in parallel
4. Document changes
5. Guard alignment continuously: ensure no feature is inadvertently disabled; verify interactions stay consistent with the diagrams and model-spec

### After Development
1. Verify no breadcrumbs
2. Update file header
3. Run complete tests
4. **README Alignment Check** - Reason whether changes affect README.md and update if necessary
5. **Checklist Alignment** - Mark corresponding items complete in `project-documents/01-execution-checklists.md` and adjust future tasks if scope shifted
6. Mandatory code review
7. Architecture Alignment Gate:
   - Compare implementation against `project-documents/system-diagrams/*` and `00-model-spec.md`
   - If behavior or boundaries changed, update diagrams and specs in the same PR
   - Confirm no regression to previously documented features; explicitly note any de-scoped items

### PR & Commit Standards
- Conventional commits; one logical change per PR; link the issue
- Keep diffs small (< ~400 LOC when possible); include tests and docs
- No red CI; all legend gates satisfied (see `01-execution-checklists.md`)

---

## 🚨 Quick Checklist

### Before Commit
- [ ] No unused imports
- [ ] No unused variables
- [ ] Error handling implemented
- [ ] Loading states configured
- [ ] **File header updated with current date (2025-08-30)**
- [ ] Tests passing
- [ ] Existing functionality intact
- [ ] Documentation updated
- [ ] **Performance impact assessed**
- [ ] **CSS quality checked with stylelint**
- [ ] **🔒 MANDATORY REQUIREMENTS CHECKED**:
  - [ ] **Terminal Commands**: No commands run by AI
  - [ ] **Lazy Loading**: Implemented for heavy components
  - [ ] **API Standards**: Followed if API work involved
  - [ ] **System Diagrams**: Updated if architecture changed
  - [ ] **Styles Library**: Used established styles system

### Before Merge
- [ ] Code review approved
- [ ] Integration tests passing
- [ ] Performance validated
- [ ] Accessibility verified
- [ ] Security review completed
- [ ] **CSS quality validated**

---

## 🎨 **CSS QUALITY STANDARDS (MANDATORY)**

### **Stylelint Commands (MANDATORY)**
**Before committing any CSS changes, run these commands:**

```bash
# Check all CSS files in the project
npm run stylelint

# Fix auto-fixable CSS issues
npm run stylelint:fix

# Check only frontend CSS files
npm run stylelint:frontend

# Fix frontend CSS issues
npm run stylelint:frontend:fix
```

### **CSS Quality Gates (MANDATORY)**
- **No CSS linting errors** before commit
- **Design tokens used** for colors, spacing, typography
- **BEM naming convention** followed for complex components
- **CSS Modules** used for component isolation
- **Responsive design** implemented with CSS Grid/Flexbox

### **CSS Architecture Rules**
- **CSS Custom Properties** for theming (light/dark/cosmic)
- **CSS Modules** for component-scoped styles
- **Design tokens** in `frontend/src/styles/tokens/`
- **BEM methodology** for complex component hierarchies
- **Mobile-first** responsive design approach

### **CSS File Organization**
```
frontend/src/styles/
├── tokens/           # Design tokens (colors, spacing, typography)
├── components/       # Component-specific CSS modules
├── layouts/          # Layout and grid systems
├── themes/           # Theme-specific overrides
└── global/           # Global styles and utilities
```

### **CSS Quality Checklist**
- [ ] **Stylelint passes** with no errors
- [ ] **Design tokens used** instead of hardcoded values
- [ ] **BEM naming** followed for complex components
- [ ] **CSS Modules** used for component isolation
- [ ] **Responsive design** implemented
- [ ] **Accessibility** considered (color contrast, focus states)
- [ ] **Performance** optimized (no unused CSS, efficient selectors)

---

## 🚀 **FRONTEND BUNDLE OPTIMIZATION & CODE SPLITTING STRATEGY (MANDATORY)**

### **Bundle Size Standards (MANDATORY)**
**Before every frontend build, ensure bundle size compliance:**
- **Main Bundle Target**: < 1MB (gzipped: < 300KB)
- **Individual Chunks**: < 500KB (gzipped: < 150KB)
- **Total Bundle Size**: < 2MB (gzipped: < 600KB)

### **Code Splitting Implementation Framework (MANDATORY)**

#### **Component-Level Splitting (Immediate Priority)**
**Implementation Pattern:**
- Lazy load heavy components (Dashboard, 3D components)
- Use React.lazy() with Suspense fallbacks
- Implement error boundaries for lazy components

#### **Route-Based Splitting (Next Priority)**
**Implementation Pattern:**
- Create centralized routing system
- Implement lazy page loading
- Optimize chunk organization for routes

#### **Advanced Optimization (Future Consideration)**
**Implementation Pattern:**
- Enhanced chunk optimization
- Dynamic imports for components
- Custom lazy loading hooks

### **Lazy Loading Implementation Standards (MANDATORY)**

#### **React.lazy() Pattern (MANDATORY)**
```typescript
import React, { lazy, Suspense } from 'react'

// Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const BlockchainScene = lazy(() => import('./components/blockchain/BlockchainScene'))

// Always wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

#### **Error Boundary Integration (MANDATORY)**
```typescript
// Wrap lazy-loaded components with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

#### **Loading States (MANDATORY)**
- **Skeleton Screens**: Show component structure while loading
- **Progress Indicators**: Visual feedback for loading progress
- **Fallback Content**: Meaningful placeholder content

### **Bundle Analysis Commands (MANDATORY)**
**Before committing any frontend changes, run these commands:**

```bash
# Build and analyze bundle
npm run build

# Check bundle size warnings
# Look for chunks > 500KB warnings

# Analyze bundle composition (if available)
npm run analyze
```

### **Performance Validation Checklist (MANDATORY)**
- [ ] **Bundle Size**: Under 1MB target
- [ ] **Chunk Sizes**: No chunks > 500KB
- [ ] **Lazy Loading**: Components load on demand
- [ ] **Loading States**: Proper fallback content
- [ ] **Error Handling**: Error boundaries implemented
- [ ] **Performance**: Initial load < 3s

### **Code Splitting Best Practices (MANDATORY)**
1. **Lazy Load by Feature**: Group related components together
2. **Lazy Load by Route**: Separate pages into different chunks
3. **Lazy Load Heavy Dependencies**: 3D libraries, large utilities
4. **Preload Critical Paths**: Load essential components immediately
5. **Monitor Bundle Growth**: Track size changes over time

### **Vite Configuration Standards (MANDATORY)**
```typescript
// frontend/vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        threejs: ['three', 'three-stdlib'],
        i18n: ['i18next', 'react-i18next'],
        utils: ['lodash', 'date-fns']
      }
    }
  }
}
```

---

## 🔧 TypeScript Error Resolution

### Common Resolution Patterns
1. **Mixed Chart Types:** Use generic Chart component or separate specific components
2. **Readonly Arrays:** Remove `as const` or use type assertion
3. **Union Types:** Transform types before use
4. **No `any`:** Never introduce `any`. Prefer precise types or `unknown` narrowed with guards. Tests must reference concrete framework types (e.g., Express) rather than `any`.

### Systematic Resolution Flow
1. Run `npm run typecheck`
2. Analyze each error completely
3. Apply appropriate resolution pattern
4. Verify resolution with `npm run typecheck`
5. Repeat until 0 errors

**Critical Rule:** I NEVER commit with TypeScript errors. I use `npm run typecheck` systematically to detect and fix errors before continuing development.

---

## 📚 Documentation Maintenance

### README Alignment
After completing any coding task, I must:
1. **Reason about impact** - Did my changes affect project structure, commands, or configuration?
2. **Check README relevance** - Are there new npm scripts, environment variables, or procedures?
3. **Update if necessary** - Keep README.md as the single source of truth
4. **Maintain consistency** - Ensure all documentation reflects current state

### Documentation Style Rules (CRITICAL)
- **`project-documents/01-development-roadmap.md` and `project-documents/01-execution-checklists.md` are MINIMAL task representations**
- **NO unnecessary completion texts or huge explanatory blocks for done items**
- **Done items are marked with `[x]` or `✅` - that's it**
- **Steps to take are NOT marked with `[x]` - this follows common sense**
- **Keep these files lean and focused on current actionable tasks**
- **If you need to explain what was done, do it in the specific documentation files, not in these task lists**

### Version Management - CRITICAL RULE
**I NEVER increment version numbers unless explicitly requested or required by development phases.**
- **Current version is 1.0.0** and remains so until explicitly stated otherwise
- **Small changes, fixes, or updates do NOT warrant version changes**
- **Version increments are controlled by development roadmap phases only**
- **I maintain version 1.0.0 for all documentation updates and corrections**

---

## ⚡ Performance Considerations

### Before Every Code Change
I must assess:
- **Memory Impact**: Will this change increase memory usage?
- **Bundle Size**: Will this affect the final bundle size?
- **Runtime Performance**: Will this impact user experience?
- **Network Impact**: Will this affect API response times?

### Performance Checklist
- [ ] **Memory**: No memory leaks, efficient data structures
- [ ] **Bundle**: No unnecessary dependencies added
- [ ] **Runtime**: No blocking operations in UI thread
- [ ] **Network**: Efficient API calls, proper caching
- [ ] **Rendering**: No unnecessary re-renders

---

## 📚 Essential Documentation References

### Core Documents
- **`project-documents/00-model-spec.md`** - System architecture and requirements
- **`docs/API-ENDPOINTS.md`** - Complete API reference
- **`docs/API-STANDARDS.md`** - API development standards
- **`docs/API-NAVIGATION.md`** - API documentation guide
- **`docs/ENVIRONMENT-SETUP.md`** - Environment configuration
- **`docs/DOCUMENTATION-NAVIGATION.md`** - Main documentation index

### System Diagrams
- **`project-documents/system-diagrams/`** - All system architecture diagrams
- **`project-documents/system-diagrams/02-component-architecture-diagram.md`** - Component relationships
- **`project-documents/system-diagrams/03-data-flow-diagram.md`** - Data flow patterns
- **`project-documents/system-diagrams/05-class-diagrams.md`** - Class relationships
- **`project-documents/system-diagrams/11-package-diagram.md`** - Package structure

### Development Tools
- **`README.md`** - Single source of truth for commands and setup
- **`project-documents/01-execution-checklists.md`** - Task tracking
- **`project-documents/01-development-roadmap.md`** - Development phases

---

## 💡 Remember

This guide is my single source of truth for high-quality, high-performance code. I consult it before every programming session to maintain consistency, excellence, and meet modern expert programming standards.

I am responsible for the quality and performance of this system. Every line of code I write reflects my commitment to excellence.

---

## ₿ Bitcoin‑Specific Safeguards (keep top of mind)
- Never bypass consensus checks; cross‑verify with Bitcoin Core when in doubt
- Reorg handling: design for invalidation depth; avoid stale cache leakage
- Reflect mempool realities in UX (RBF/CPFP, eviction, fee volatility)
- Treat script parsing as security‑sensitive; fuzz and property‑test extensively
