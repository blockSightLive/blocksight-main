# 🚀 High-Performance Code Standards - My Development Guide

## Purpose
I am the software engineer of this system and it is my sole responsibility that it works fully as stated by the Model Spec file.

When I edit a file in this codebase I leave the real time date in which the file was edited (today is the 11th day of August, 2025).

**Purpose:** My personal reference for writing high-quality, high-performance code  
**Audience:** Me - the lead software engineer  
**Usage:** Review before every coding session and during code reviews  
**Version:** 1.0.0  
**Last Updated:** 2025-08-11  
**Level:** Expert/Production-Ready

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

### Structural & Behavioral Patterns
- **Structural:** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
- **Behavioral:** Chain of Responsibility, Command, Iterator, Mediator, Memento, State, Template Method, Visitor

---

## 🔷 Axioms (operate by default)
- Correctness before performance; never trade consensus safety for speed
- Small, reversible changes; one logical change per PR; fast review cycles
- Tests define behavior; critical paths use TDD where feasible
- Automate repeatable work; measure to improve (DORA, P50/P95/P99)
- Fail safely: timeouts, retries, circuit breakers, rollbacks designed first
- Single source of truth for commands/processes is `README.md`

---

## ⏱️ 5‑Minute Pre‑Flight (before any task)
- Read `project-documents/00-model-spec.md`, roadmap, and `01-execution-checklists.md`
- Define scope, assumptions, constraints, and acceptance criteria
- Choose paradigm/patterns; declare SLO/budget impact (latency/memory)
- Plan tests (unit/integration/contract/E2E) and data fixtures
- Confirm batching: can I finish in one edit (max two) per file?
 - Cross-check system intent: review `project-documents/system-diagrams/*` to verify module boundaries, data flows, and responsibilities relevant to this task

---

## ✅ Definition of Ready / ✅ Definition of Done
- DoR: Issue linked; design/pattern chosen; test plan; budgets; risks noted
- DoD: Code + tests + docs updated; gates pass (lint/type/test/sec/perf); no breadcrumbs; README alignment checked

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

### Task Management
I document in file headers:
- Priority levels (HIGH/MEDIUM/LOW)
- Technical debt items
- Future improvements

---

## 🔒 Code Integrity Rules

### Functionality Preservation
Before any change, I:
1. Verify existing tests
2. Document current functionality
3. Create regression tests
4. Implement changes incrementally
5. Verify nothing breaks

### Safe Development Pattern
- Use feature flags for major changes
- Always have rollback plans
- Mandatory integration tests

### Security Essentials (always)
- Validate and sanitize inputs; deny by default; least privilege
- Secrets never in code; use env/secrets manager; rotate regularly
- SBOM + dependency and license scanning; pin submodule commits
- OWASP Top 10 awareness; SSRF/SQLi/XSS/CSRF mitigations where relevant

### Terminal Command Restriction
I never execute commands automatically. I always:
- Request user approval
- Check the [README.md](../README.md) for all available commands
- Use documented npm/yarn scripts for automation

**Important**: The README.md is my single source of truth for all terminal commands, project structure, and operational procedures. I refer to it whenever I need to:
- Find the right command to run
- Understand project structure
- Set up environments
- Access configuration details
- Deploy or test the system

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
- Every new file must be placed alongside files with similar responsibility.
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

### Modern React Patterns
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

### Data & Migrations
- Prefer append‑only models; derive rollups; keep operations idempotent
- Schema changes: forward/backward compatible; include down‑migrations; data backfill scripts are testable

---

## 🔄 Development Workflow

### Before Writing Code
1. Review this guide
2. Understand file context
3. Plan implementation
4. Verify dependencies
5. Architecture alignment: confirm the change matches `00-model-spec.md` scope and current diagrams; identify any diagram/doc updates required

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

### Error Detection System
I run these commands after every change:
```bash
npm run typecheck  # Detect ALL TypeScript errors
npm run build      # Detect build errors
npm run test       # Detect test errors
```

**Critical Rule:** I NEVER commit with TypeScript errors. I use `npm run typecheck` systematically to detect and fix errors before continuing development.

---

## 🚨 Quick Checklist

### Before Commit
- [ ] No unused imports
- [ ] No unused variables
- [ ] Error handling implemented
- [ ] Loading states configured
- [ ] **File header updated with current date (2025-08-11)**
- [ ] Tests passing
- [ ] Existing functionality intact
- [ ] Documentation updated
- [ ] **Performance impact assessed**

### Before Merge
- [ ] Code review approved
- [ ] Integration tests passing
- [ ] Performance validated
- [ ] Accessibility verified
- [ ] Security review completed

---

## 🔧 TypeScript Error Resolution

### Common Resolution Patterns
1. **Mixed Chart Types:** Use generic Chart component or separate specific components
2. **Readonly Arrays:** Remove `as const` or use type assertion
3. **Union Types:** Transform types before use

### Systematic Resolution Flow
1. Run `npm run typecheck`
2. Analyze each error completely
3. Apply appropriate resolution pattern
4. Verify resolution with `npm run typecheck`
5. Repeat until 0 errors

---

## 📚 Additional Resources

### Technical References
- React Best Practices
- TypeScript Handbook
- Design Patterns
- Clean Code Principles

### Quality Tools
- ESLint + Prettier
- SonarQube
- Lighthouse CI
- Jest + React Testing Library

---

## 📚 Documentation Maintenance

### README Alignment
After completing any coding task, I must:
1. **Reason about impact** - Did my changes affect project structure, commands, or configuration?
2. **Check README relevance** - Are there new npm scripts, environment variables, or procedures?
3. **Update if necessary** - Keep README.md as the single source of truth
4. **Maintain consistency** - Ensure all documentation reflects current state

### Version Management - CRITICAL RULE
**I NEVER increment version numbers unless explicitly requested or required by development phases.**
- **Current version is 1.0.0** and remains so until explicitly stated otherwise
- **Small changes, fixes, or updates do NOT warrant version changes**
- **Version increments are controlled by development roadmap phases only**
- **I maintain version 1.0.0 for all documentation updates and corrections**

### File Header Updates
Every file I edit must have updated headers with:
- Current date (today is 2025-08-11)
- Accurate state information
- Updated dependencies if changed
- New bugs or limitations discovered

---

## ⚡ Performance Considerations

### Before Every Code Change
I must assess:
- **Memory Impact**: Will this change increase memory usage?
- **Bundle Size**: Will this affect the final bundle size?
- **Runtime Performance**: Will this impact user experience?
- **Network Impact**: Will this affect API response times?

### Backpressure & Budgets
- Enforce per‑endpoint SLOs (P50/P95/P99); reject or degrade when over budget
- Apply caching tiers appropriately (L1 Redis, L2 mmap, L3 HTTP); measure hit ratios

### Performance Checklist
- [ ] **Memory**: No memory leaks, efficient data structures
- [ ] **Bundle**: No unnecessary dependencies added
- [ ] **Runtime**: No blocking operations in UI thread
- [ ] **Network**: Efficient API calls, proper caching
- [ ] **Rendering**: No unnecessary re-renders

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
