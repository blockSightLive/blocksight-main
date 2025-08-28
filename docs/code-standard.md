# 🚀 Code Standards - Development Rulebook

**Purpose:** High-quality, high-performance code reference  
**Audience:** Lead software engineer  
**Usage:** Review before coding sessions and code reviews  
**Version:** 1.0.0  
**Last Updated:** 2025-08-27

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

## 🎨 CSS Styling Strategy

### **⚠️ STYLE SYSTEM REFERENCE RULE**
**Before ANY styling work:**
1. **Consult** `frontend/src/styles/README.md` first
2. **Use** design tokens instead of hard-coded values
3. **Respect** CSS cascade order

### **Technology Selection**
- **CSS Modules** - Static layouts, grids, containers
- **CSS Custom Properties** - Themes, global values, design tokens
- **Styled Components** - Interactive elements, state-based styling

### **File Organization**
- **CSS Modules** MUST be co-located with components
- **Design tokens** centralized in `styles/design-tokens/`
- **Components** grouped by UI area, not by type

---

## 🔷 Axioms
- Correctness before performance; never trade consensus safety for speed
- Small, reversible changes; one logical change per PR; fast review cycles
- Tests define behavior; critical paths use TDD where feasible
- Fail safely: timeouts, retries, circuit breakers, rollbacks designed first
- Single source of truth for commands/processes is `README.md`
- **Styling quality equals code quality - no exceptions**

---

## ⏱️ Pre‑Flight Checklist
- Read `project-documents/00-model-spec.md` and relevant system diagrams
- Define scope, constraints, and acceptance criteria
- Choose paradigm/patterns; declare SLO/budget impact
- Plan tests and data fixtures
- **Plan styling approach: CSS Modules, Custom Properties, or Styled Components**
- Confirm batching: can I finish in one edit (max two) per file?

---

## ✅ Definition of Ready / Done
- **DoR:** Issue linked; design/pattern chosen; test plan; styling approach selected
- **DoD:** Code + tests + docs updated; styling implemented; gates pass; no breadcrumbs; README aligned

## 🧹 Code Cleanliness Rules

### Eliminate Breadcrumbs
- No unused imports, variables, or empty functions
- No debug console.log statements
- No TODO comments without dates
- **No unstyled components or incomplete styling**

### TODO Documentation & Mock Data Tracking
- **ALL TODO items** in file header `@todo` section
- **Mock data sources** clearly marked in header comments
- **Hard-coded values** documented as temporary
- **Styling approach** documented in file header

### Systematic Development
- Identify all affected files
- Implement changes across all necessary levels
- Update types, interfaces, and tests
- **Implement complete styling for all components**
- Verify complete integration
- Document changes in all files

### Horizontal Development Methodology
**Phase 1: Horizontal Expansion (Create the Expanse)**
- Create ALL necessary files (components, hooks, utilities, types, tests)
- Set up ALL imports and dependencies
- Establish ALL file structures with proper naming conventions
- Document ALL pending tasks in file headers
- Plan styling approach for each component

**Phase 2: Vertical Implementation (Build Each Component)**
- Go through files one by one in logical dependency order
- Complete each file fully - no partial implementations
- Replace mock data systematically with real implementations
- **Implement complete styling immediately** - no unstyled components
- Update tests and documentation as each component is completed
- Verify integration and polish styling

---

## 📝 File Header Structure

Every file must have this header:

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
 * @state
 * ✅ [Current state: Functional, In Development, Known Bug]
 * 
 * @bugs
 * - [List of known bugs or limitations]
 * 
 * @todo
 * - [Pending tasks with priority]
 * 
 * @mockData
 * - [List of current mock data sources and replacement targets]
 * 
 * @styling
 * - [CSS approach: Modules, Custom Properties, or Styled Components]
 */
```

---

## ⚡ State & Error Management

### Mandatory Error Handling
```typescript
try {
  const result = await criticalOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Critical operation failed:', error);
  return { success: false, error: error.message, fallback: getFallbackData() };
}
```

### Loading States
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

### Mock Data & Placeholder Management
**Mandatory Documentation:**
- **ALL mock data** in file header `@mockData` section
- **ALL hard-coded values** marked as temporary
- **ALL API integration points** listed as pending tasks
- **ALL styling approaches** documented in `@styling` section

**Mock Data Categories:**
- **Static Values** - Hard-coded numbers, strings, or objects
- **API Responses** - Mocked external service responses
- **User Input** - Placeholder form data or user interactions
- **Configuration** - Temporary settings or environment variables
- **Test Data** - Sample data for development and testing

### Functionality Preservation
Before any change:
1. Verify existing tests
2. Document current functionality
3. Create regression tests
4. Implement changes incrementally
5. Verify nothing breaks
6. **Verify styling remains intact**

### Safe Development Pattern
- Use feature flags for major changes
- Always have rollback plans
- Mandatory integration tests
- **Mandatory styling validation**

### Security Essentials
- Validate and sanitize inputs; deny by default; least privilege
- Secrets never in code; use env/secrets manager; rotate regularly
- SBOM + dependency and license scanning; pin submodule commits
- OWASP Top 10 awareness; SSRF/SQLi/XSS/CSRF mitigations where relevant

### Terminal Command Restriction
I never execute commands automatically. I always:
- Request user approval
- Check the [README.md](../README.md) for all available commands
- Use documented npm/yarn scripts for automation

**Environment Variables Policy:**
- Prefer `.env` files for configuration
- Frontend uses Vite: variables must start with `VITE_`
- Backend uses process env directly
- Keep secrets only in local `.env` files, never commit real values

**PowerShell Syntax:**
- PowerShell does NOT support `&&` syntax for command chaining
- Use separate commands or `;` for PowerShell command separation

**Important**: README.md is single source of truth for all terminal commands, project structure, and operational procedures.

Also always cross‑reference `project-documents/` and its `system-diagrams/` folder before designing or editing system‑wide functionality. These diagrams define boundaries, flows, and responsibilities that all code must align with.

### Systematic File Editing
**Methodology:**
1. Analyze complete file before editing
2. Plan ALL necessary changes - batch into ONE SINGLE EDIT per file
3. Edit file ONCE - Maximum 2 edits per file if absolutely necessary
4. Save missing items in memory if can't complete in 1-2 edits
5. Verify errors immediately
6. Integrate with related files
7. Update documentation
8. **Implement complete styling**

**Critical Rule**: Reason about batching before touching any file. If can't complete in 1-2 edits, save remaining work for next response.

### File Placement and Responsibility Grouping
- **ALWAYS place new files alongside files with similar responsibility**
- **Use folder names as guidance** - use `grep` to search folder names and existing file patterns
- **Group by responsibility, not by type** - e.g., all Bitcoin Core setup docs go together
- **CSS Modules MUST be co-located with their components**
- Keep diagrams and documentation references up to date whenever files move
- Root should remain lean (e.g., `README.md` as entry point)

### Runtime Standardization
- Prefer Docker images as the authoritative runtime specification
- `.nvmrc` is advisory only; Dockerfile/compose define the canonical versions
- Provide a single, multi-stage Dockerfile at repo root
- Use `docker-compose.dev.yml` to orchestrate dev services

---

## 🏗️ Architecture & Patterns

### Modern React Patterns
- Custom hooks with optimizations
- Memoization for expensive calculations
- Debouncing with cleanup
- Error boundaries
- Suspense and concurrent features
- Server components when appropriate

### Advanced TypeScript
- Strict types with validation
- Utility types and conditional types
- Template literal types
- Mapped types with transformations
- Branded types for type safety
- Discriminated unions

### Advanced CSS Architecture
- CSS Modules for component isolation
- CSS Custom Properties for theming
- Styled Components for dynamic styling
- Mobile-first responsive design
- CSS Grid and Flexbox for layouts
- CSS animations and transitions
- Performance-optimized CSS

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
- **Styling Tests:** Visual regression testing

### Performance Targets
- **Bundle Size:** < 1MB
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms
- **Time to Interactive:** < 3s
- **Lighthouse Score:** ≥ 90
- **CSS Performance:** No layout thrashing, smooth 60fps animations

### Code Quality
- **Complexity:** ≤ 10 per function
- **Lines per function:** ≤ 50
- **Nesting depth:** ≤ 4 levels
- **Cognitive complexity:** ≤ 15
- **Maintainability index:** ≥ 65
- **Technical debt ratio:** ≤ 5%
- **Styling quality:** Pixel-perfect implementation

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
6. **Mock Data Planning**: Identify what data will be mocked initially and document replacement targets
7. **Styling Planning**: Choose CSS approach (Modules, Custom Properties, or Styled Components)
8. **Style System Review**: Consult `frontend/src/styles/README.md` for CSS architecture and patterns

### During Development
1. Follow established patterns
2. Implement error handling
3. Write tests in parallel
4. Document changes
5. Guard alignment continuously: ensure no feature is inadvertently disabled; verify interactions stay consistent with the diagrams and model-spec
6. **Mock Data Documentation**: Update `@mockData` section whenever new mock data is added
7. **TODO Tracking**: Add new TODO items to file headers as they are discovered
8. **Styling Implementation**: Implement complete styling immediately after component logic
9. **Style System Compliance**: Follow `frontend/src/styles/README.md` for all styling decisions

### After Development
1. Verify no breadcrumbs
2. Update file header
3. Run complete tests
4. **README Alignment Check** - Reason whether changes affect README.md and update if necessary
5. **Checklist Alignment** - Mark corresponding items complete in `project-documents/01-execution-checklists.md` and adjust future tasks if scope shifted
6. **Mock Data Review** - Verify all mock data is documented and replacement tasks are tracked
7. **TODO Cleanup** - Remove completed TODO items and update remaining ones
8. **Styling Validation** - Verify all components are properly styled and responsive
9. Mandatory code review
10. Architecture Alignment Gate:
   - Compare implementation against `project-documents/system-diagrams/*` and `00-model-spec.md`
   - If behavior or boundaries changed, update diagrams and specs in the same PR
   - Confirm no regression to previously documented features; explicitly note any de-scoped items

### PR & Commit Standards
- Conventional commits; one logical change per PR; link the issue
- Keep diffs small (< ~400 LOC when possible); include tests and docs
- No red CI; all legend gates satisfied (see `01-execution-checklists.md`)
- **All styling must be complete and polished**

### Error Detection System
**Automated Pipeline Integration:**
- Commands run automatically on push/PR via CI/CD pipeline
- Manual checks available via `npm run typecheck`, `npm run build`, `npm run test`, `npm run lint`
- Focus on development iteration, not constant validation during coding sessions

### CSS Lint Commands

**Test ALL CSS files:**
```bash
npx stylelint "frontend/src/**/*.css" | cat
```

**Test only CSS Modules:**
```bash
npx stylelint "frontend/src/**/*.module.css" | cat
```

**Auto-fix simple errors:**
```bash
npx stylelint "frontend/src/**/*.css" --fix
```

**Critical Rule:** NEVER commit with TypeScript errors. Use `npm run typecheck` systematically.

---

## 🚨 Quick Checklist

### Before Commit
- [ ] No unused imports/variables
- [ ] Error handling and loading states implemented
- [ ] **File header updated with current date**
- [ ] Tests passing, functionality intact
- [ ] Documentation updated
- [ ] **Complete styling implemented and responsive**
- [ ] **Accessibility and style system compliance verified**
- [ ] **Run final validation: `npm run typecheck && npm run build`**

### Before Merge
- [ ] Code review approved
- [ ] Integration tests passing
- [ ] Performance, accessibility, and security validated
- [ ] **Styling review completed and visual regression tests passed**

---

## 🔧 TypeScript Error Resolution

### Common Resolution Patterns
- **Mixed Chart Types:** Use generic Chart component or separate specific components
- **Readonly Arrays:** Remove `as const` or use type assertion
- **Union Types:** Transform types before use
- **No `any`:** Never introduce `any`. Prefer precise types or `unknown` narrowed with guards

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
- **CSS Modules Documentation**
- **CSS Custom Properties Guide**
- **Styled Components Best Practices**

### Quality Tools
- ESLint + Prettier
- SonarQube
- Lighthouse CI
- Jest + React Testing Library
- **CSS Modules TypeScript Support**
- **Visual Regression Testing Tools**

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

### File Header Updates
Every file I edit must have updated headers with:
- Current date (today is 2025-08-27)
- Accurate state information
- Updated dependencies if changed
- New bugs or limitations discovered
- **Styling approach and implementation status**

---

## ⚡ Performance Considerations

### Before Every Code Change
Assess:
- **Memory Impact**: Will this change increase memory usage?
- **Bundle Size**: Will this affect the final bundle size?
- **Runtime Performance**: Will this impact user experience?
- **Network Impact**: Will this affect API response times?
- **CSS Performance**: Will this affect rendering performance?

### Performance Checklist
- [ ] **Memory**: No memory leaks, efficient data structures
- [ ] **Bundle**: No unnecessary dependencies added
- [ ] **Runtime**: No blocking operations in UI thread
- [ ] **Network**: Efficient API calls, proper caching
- [ ] **Rendering**: No unnecessary re-renders
- [ ] **CSS**: No layout thrashing, efficient animations
- [ ] **Responsive**: Mobile-first design, no desktop-only features

---

## 💡 Remember

This guide is my single source of truth for high-quality, high-performance code. I consult it before every programming session to maintain consistency, excellence, and meet modern expert programming standards.

**Styling quality equals code quality - no exceptions.**

---

## ₿ Bitcoin‑Specific Safeguards
- Never bypass consensus checks; cross‑verify with Bitcoin Core when in doubt
- Reorg handling: design for invalidation depth; avoid stale cache leakage
- Reflect mempool realities in UX (RBF/CPFP, eviction, fee volatility)
- Treat script parsing as security‑sensitive; fuzz and property‑test extensively

### System Architecture Alignment
**ALL frontend development MUST align with our system architecture:**

**Data Flow:** BitcoinCore → electrs → electrs-db → (our-db) → cache → backend → frontend

**Frontend Role:** 100% READ-ONLY blockchain viewer
- **NO blockchain modifications** - We only consume existing data
- **NO transaction creation** - We only display and analyze
- **NO address generation** - We only search and view existing addresses

**Reducer Actions Must Reflect Data Reception:**
- Use clean, concise action names (e.g., `BLOCK_NEW`, not `RECEIVE_NEW_BLOCK_FROM_BACKEND`)
- Actions represent data received from backend, not created by user
- All data originates from the single source of truth (BitcoinCore via electrs)
- Frontend is passive - receives updates, never initiates changes

### Naming Convention Compliance
**ALL development MUST follow our centralized naming conventions:**

**Reference Document:** `frontend/src/constants/naming-conventions.md` - Single source of truth

**Core Principles:**
- **KISS (Keep It Simple, Stupid)** - Short names over long names
- **Context is King** - Names make sense in usage context, avoid redundant information
- **Systematic Consistency** - Follow established patterns religiously

**Quality Gates:**
- **Length:** ≤ 25 characters for actions, ≤ 15 for variables
- **Clarity:** Self-explanatory in context
- **Consistency:** Follows established patterns
