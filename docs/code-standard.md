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

## 🚨 OVER-ENGINEERING PREVENTION (CRITICAL LESSON LEARNED)

**NEVER over-engineer simple fixes. The goal is to solve the immediate problem with minimal changes.**

**What NOT to do:**
- ❌ **Don't create new type files** for simple inline type fixes
- ❌ **Don't refactor multiple files** when fixing a single lint error
- ❌ **Don't introduce "clean architecture"** when the current code works
- ❌ **Don't create shared abstractions** for one-off usage

**What TO do instead:**
- ✅ **Use inline types** for simple, localized fixes
- ✅ **Fix only the specific error** without touching unrelated code
- ✅ **Keep existing patterns** unless there's a clear architectural benefit
- ✅ **Question whether new files/abstractions are needed**

**Remember**: The best code is the code that solves the problem with the least complexity. Don't let "perfect" be the enemy of "working."

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

**See `docs/middleware-patterns.md` for complete implementation details**

**Critical Reminders:**
- **Middleware stack order is CRITICAL** - never change without understanding impact
- **Always implement cleanup methods** for background processes in tests
- **Use standardized error responses** via ApiErrorResponse interface
- **Apply validation before route handlers** with Zod schemas
- **Test middleware in isolation and integration**

### **🧪 TESTING ARCHITECTURE (MANDATORY)**

**See `project-documents/system-diagrams/12-testing-architecture-diagram.md` for complete testing architecture, patterns, and standards.**

**Critical Reminders:**
- **Background processes MUST have cleanup methods** to prevent Jest hanging
- **Always use beforeEach/afterEach** for app lifecycle management
- **Never create apps inside individual tests** - use shared instances
- **Always call cleanup** after each test to prevent "open handle" errors
- **Test cleanup methods** to ensure they work correctly

### **📊 MONITORING & OBSERVABILITY (MANDATORY)**

**Available Endpoints:**
- **`/metrics`** - Prometheus metrics
- **`/api/v1/metrics/health`** - System health
- **`/api/v1/cache/stats`** - Cache performance
- **`/api/v1/cache/invalidate/:service`** - Cache invalidation

**Performance Budgets:**
- **API Response**: P95 < 200ms (cached), < 1000ms (uncached)
- **Cache Hit Rate**: > 80%
- **Error Rate**: < 1%
- **Memory**: < 512MB

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
- [ ] **🧪 Background Process Cleanup**: All tests properly clean up intervals/timeouts
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

**See `docs/css-quality-standards.md` for complete implementation details**

**Critical Reminders:**
- **Run stylelint before commit**: `npm run stylelint`
- **Use CSS Modules** for component isolation
- **Implement design tokens** via CSS Custom Properties
- **Follow BEM methodology** for complex components
- **Mobile-first responsive design** approach
- **Ensure accessibility compliance** (WCAG 2.1 AA)

---

## 🚀 **FRONTEND BUNDLE OPTIMIZATION & CODE SPLITTING STRATEGY (MANDATORY)**

**See `docs/frontend-bundle-strategy.md` for complete implementation details**

**Critical Reminders:**
- **Bundle Size Targets**: Main < 1MB, Chunks < 500KB, Total < 2MB
- **Always implement lazy loading** for heavy components
- **Use React.lazy() with Suspense** for code splitting
- **Implement error boundaries** around lazy components
- **Run `npm run build`** to check bundle size warnings
- **Monitor chunk sizes** and optimize with Vite manual chunks

---

## 🔧 TypeScript Error Resolution

**Critical Rule:** I NEVER commit with TypeScript errors. Use `npm run typecheck` systematically.

**Common Patterns:**
- **Mixed Chart Types:** Use generic components or separate specific ones
- **Readonly Arrays:** Remove `as const` or use type assertion  
- **Union Types:** Transform types before use
- **No `any`:** Use precise types or `unknown` with guards

---

## 📚 Documentation Maintenance

**README Alignment:** Always check if changes affect project structure, commands, or configuration.

**Documentation Style Rules:**
- **Task lists are MINIMAL** - mark done with `[x]` only
- **No explanatory blocks** for completed items
- **Keep files lean** and focused on actionable tasks

**Version Management:** NEVER increment versions unless explicitly required by development phases.

---

## ⚡ Performance Considerations

**Always assess impact before changes:**
- **Memory**: No leaks, efficient data structures
- **Bundle**: No unnecessary dependencies
- **Runtime**: No blocking operations in UI thread
- **Network**: Efficient API calls, proper caching

---

## 📚 Essential Documentation References

**📋 See `docs/DOCUMENTATION-INDEX.md` for complete, organized documentation reference**

### Core Documents
- **`project-documents/00-model-spec.md`** - System architecture and requirements
- **`docs/API-ENDPOINTS.md`** - Complete API reference
- **`docs/API-STANDARDS.md`** - API development standards
- **`docs/ENVIRONMENT-SETUP.md`** - Environment configuration

### Implementation Guides
- **`project-documents/system-diagrams/12-testing-architecture-diagram.md`** - Complete testing architecture, patterns, and standards
- **`docs/middleware-patterns.md`** - Middleware architecture and implementation
- **`docs/frontend-bundle-strategy.md`** - Frontend optimization and code splitting
- **`docs/css-quality-standards.md`** - CSS architecture and quality standards

### System Diagrams
**📊 `project-documents/system-diagrams/` - ALL system architecture diagrams**
- **`01-system-context-diagram.md`** - System boundaries and external integrations
- **`02-component-architecture-diagram.md`** - Component relationships and data flow
- **`03-data-flow-diagram.md`** - Data flow patterns and API interactions
- **`12-testing-architecture-diagram.md`** - Testing patterns and background process management

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
