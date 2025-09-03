# 🚀 High-Performance Code Standards - Development Rulebook

## Purpose
**Purpose:** Single source of truth for high-quality, high-performance code development  
**Audience:** Lead software engineer  
**Usage:** Review before every coding session and during code reviews  
**Version:** 1.0.0  
**Last Updated:** 2025-September-03  
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

---

## 🚨 MANDATORY DEVELOPMENT REQUIREMENTS (CRITICAL)

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
- **Bitcoin RPC compliance**: All blockchain data must use official Bitcoin Core RPC methods with proper type safety

---

## ⏱️ 5‑Minute Pre‑Flight (MANDATORY)

### Documentation Review
- Read `project-documents/00-model-spec.md`, roadmap, and `01-execution-checklists.md`
- **MANDATORY API REVIEW**: For any API work, read `docs/API-ENDPOINTS.md` and `docs/API-STANDARDS.md`
- **MANDATORY BITCOIN RPC REVIEW**: For any blockchain work, read `docs/bitcoin-rpc-reference.md` and `frontend/src/types/bitcoin-rpc.ts`
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

### Console Logging Standards (MANDATORY)
- **PRODUCTION**: Zero console.log statements allowed
- **DEVELOPMENT**: Maximum 3 console.log per file
- **CRITICAL ONLY**: Log only errors, warnings, and essential state changes
- **NO DEBUG LOGS**: Remove all debug/development console.log before commit
- **PERFORMANCE**: Console spam creates browser performance issues

### Comment Quality Standards (MANDATORY)
- **SMART COMMENTS ONLY**: Explain WHY, not WHAT
- **NO DELETION COMMENTS**: Never write `//DELETED THIS AND THAT`
- **NO OBVIOUS COMMENTS**: Don't comment self-explanatory code
- **BUSINESS LOGIC**: Comment complex business rules and algorithms
- **ARCHITECTURE**: Document design decisions and trade-offs
- **MAINTENANCE**: Comment workarounds and technical debt

---

## 📝 File Header Structure (MANDATORY)

Every file I create must have complete header with fileoverview, version, author, dates, description, dependencies, usage, state, bugs, todo, performance, and security sections.

---

## ⚡ State & Error Management (MANDATORY)

### Mandatory Error Handling
I implement success/error pattern for all critical operations with fallback data.

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

## 🔒 Code Integrity Rules (MANDATORY)

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

## 🚨 CRITICAL LESSONS LEARNED

### **BUILD OPTIMIZATION DISASTER PREVENTION (CRITICAL)**
**NEVER change external packages for "optimization" without thorough testing. Package changes can break the entire build and cost days of debugging.**

**What NOT to do:**
- ❌ **Don't replace packages** with "lighter alternatives" without testing
- ❌ **Don't minify/optimize external dependencies** without understanding impact
- ❌ **Don't change build tools** without comprehensive testing
- ❌ **Don't assume package swaps are safe** - they often break compatibility

**What TO do instead:**
- ✅ **Test package changes in isolation** before integration
- ✅ **Use bundle analyzers** to identify real optimization opportunities
- ✅ **Optimize your own code first** before changing external packages
- ✅ **Create rollback plans** for any build system changes

**Remember**: A "small optimization" can cost a full day of debugging. Optimize your own code, not external packages.

### **OVER-ENGINEERING PREVENTION (CRITICAL)**
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

## 🎯 **FRONTEND STATE ORCHESTRATION RULE (MANDATORY)**

**All frontend state MUST go through the centralized orchestrator system:**

1. **NO direct API calls** from individual components
2. **NO isolated state management** outside the orchestrator
3. **ALL data flows** through the main orchestrator context
4. **WebSocket connections** managed centrally
5. **Caching strategy** unified across all data sources
6. **Error handling** coordinated at orchestrator level

**See `project-documents/system-diagrams/13-context-orchestration-diagram.md` for complete implementation details.**

### **Available Context Plugins:**
1. **BlockchainContext** - Manages blockchain data, height, mempool, and block information
2. **ElectrumContext** - Handles Electrum server connections and historical data
3. **ExternalAPIContext** - Manages external API data (prices, FX rates)
4. **SystemContext** - Handles system health, performance metrics, and service status



---

## 🚨 **ERROR BOUNDARY RULE (MANDATORY)**

**ALL critical components MUST be wrapped with error boundaries:**

1. **NO white screens** - Every component crash must have a fallback UI
2. **NO infinite error loops** - Implement circuit breaker patterns
3. **ALWAYS provide user feedback** - Clear error messages with actionable steps
4. **IMPLEMENT graceful degradation** - System continues functioning despite failures

**Required Error Boundaries:**
- **RouterErrorBoundary**: For React Router navigation errors
- **ErrorBoundary**: For component crashes and runtime errors
- **ThreeJSErrorBoundary**: For WebGL/Three.js components
- **useErrorBoundary Hook**: For functional component error handling

**Error Classification System:**
- **ErrorCategory**: RENDER, LIFECYCLE, EVENT_HANDLER, ASYNC_OPERATION, WEBGL_THREEJS, WEBSOCKET, STATE_MANAGEMENT, ROUTING
- **ErrorSeverity**: LOW, MEDIUM, HIGH, CRITICAL
- **Auto-Recovery**: Enabled for LOW/MEDIUM severity errors
- **Error Thresholds**: Configurable limits per component type

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

---

## 🏗️ Architecture & Patterns

### **MANDATORY API DEVELOPMENT STANDARDS**
**Before ANY API work, I MUST:**

1. **Read API Documentation**: `docs/API-ENDPOINTS.md` and `docs/API-STANDARDS.md`
2. **Follow Response Format**: Use standardized `{ ok: boolean, data: T, timestamp: number }` structure
3. **Implement Error Handling**: Use `docs/API-STANDARDS.md` error codes and formats
4. **Add Input Validation**: Implement Zod schemas for all endpoints
5. **Update System Diagrams**: Ensure diagrams reflect current API structure

**See `docs/API-STANDARDS.md` for complete implementation details.**

### **Bitcoin RPC Standards**
- **NEVER call Bitcoin RPC methods directly** from components or hooks
- **ALWAYS go through MainOrchestrator** and context plugins
- **Use typed RPC methods** from `frontend/src/types/bitcoin-rpc.ts`
- **Follow rate limiting**: Maximum 1 RPC request per second per method

**See `docs/bitcoin-rpc-reference.md` for complete implementation details.**

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

## 🚨 Quick Checklist

### Before Commit
- [ ] No unused imports
- [ ] No unused variables
- [ ] Error handling implemented
- [ ] Loading states configured
- [ ] **File header updated with current date**
- [ ] Tests passing
- [ ] Existing functionality intact
- [ ] Documentation updated
- [ ] **Performance impact assessed**
- [ ] **Console Logging Checked**: Maximum 3 logs per file, no debug logs
- [ ] **Comment Quality Verified**: Smart comments only, no deletion comments
- [ ] **Error Boundaries Verified**: All critical components wrapped with appropriate ErrorBoundary
- [ ] **🔒 MANDATORY REQUIREMENTS CHECKED**:
  - [ ] **Terminal Commands**: No commands run by AI
  - [ ] **Lazy Loading**: Implemented for heavy components
  - [ ] **API Standards**: Followed if API work involved
  - [ ] **System Diagrams**: Updated if architecture changed
  - [ ] **Styles Library**: Used established styles system
  - [ ] **Context Orchestration**: Updated if MainOrchestrator/context plugins changed
  - [ ] **Error Boundary Coverage**: All components that might crash are protected

### Before Merge
- [ ] Code review approved
- [ ] Integration tests passing
- [ ] Performance validated
- [ ] Accessibility verified
- [ ] Security review completed

---

## 🔧 TypeScript Error Resolution (MANDATORY)

**Critical Rule:** I NEVER commit with TypeScript errors. Use `npm run typecheck` systematically.

**Common Patterns:**
- **Mixed Chart Types:** Use generic components or separate specific ones
- **Readonly Arrays:** Remove `as const` or use type assertion  
- **Union Types:** Transform types before use
- **No `any`:** Use precise types or `unknown` with guards

---

## 📚 Documentation Maintenance (MANDATORY)

**README Alignment:** Always check if changes affect project structure, commands, or configuration.

**Documentation Style Rules:**
- **Task lists are MINIMAL** - mark done with `[x]` only
- **No explanatory blocks** for completed items
- **Keep files lean** and focused on actionable tasks

**Version Management:** NEVER increment versions unless explicitly required by development phases.

**🚨 CRITICAL: Context Orchestration Diagram Updates**
- **ALWAYS update** `project-documents/system-diagrams/13-context-orchestration-diagram.md` when:
  - New context plugins are added/removed
  - WebSocket event types change
  - MainOrchestrator architecture evolves
  - Context relationships change
- **This diagram is the single source of truth** for frontend context orchestration
- **Update frequency**: Every development session that touches context architecture

---

## ⚡ Performance Considerations (MANDATORY)

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
- **`docs/middleware-patterns.md`** - Middleware architecture and implementation
- **`docs/frontend-bundle-strategy.md`** - Frontend optimization and code splitting
- **`docs/css-quality-standards.md`** - CSS architecture and quality standards
- **`docs/bitcoin-rpc-reference.md`** - Bitcoin RPC implementation guide

### System Diagrams
**📊 `project-documents/system-diagrams/` - ALL system architecture diagrams**
- **`01-system-context-diagram.md`** - System boundaries and external integrations
- **`02-component-architecture-diagram.md`** - Component relationships and data flow
- **`03-data-flow-diagram.md`** - Data flow patterns and API interactions
- **`12-testing-architecture-diagram.md`** - Testing patterns and background process management
- **`13-context-orchestration-diagram.md`** - Frontend context orchestration architecture

### Development Tools
- **`README.md`** - Single source of truth for commands and setup
- **`project-documents/01-execution-checklists.md`** - Task tracking
- **`project-documents/01-development-roadmap.md`** - Development phases

---

## 💡 Remember

This file is for rules only, not for summaries, state, or comments.
I do not add things to this file myself.
I do not run commands unless explicitly told to.
I do not create more markdown files.

This guide is my single source of truth for high-quality, high-performance code. I consult it before every programming session to maintain consistency, excellence, and meet modern expert programming standards.

I am responsible for the quality and performance of this system. Every line of code I write reflects my commitment to excellence.

---

## ₿ Bitcoin‑Specific Safeguards (keep top of mind)
- Never bypass consensus checks; cross‑verify with Bitcoin Core when in doubt
- Reorg handling: design for invalidation depth; avoid stale cache leakage
- Reflect mempool realities in UX (RBF/CPFP, eviction, fee volatility)
- Treat script parsing as security‑sensitive; fuzz and property‑test extensively