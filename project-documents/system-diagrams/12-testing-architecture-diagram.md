# Testing Architecture Diagram

## Overview
This diagram shows the testing architecture for the Blocksight system, including testing layers, background process management patterns, and integration with CI/CD.

## Testing Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TESTING PYRAMID                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                        E2E Tests                           │ │
│  │                    (health.e2e.test.ts)                    │ │
│  │                    - Full app lifecycle                    │ │
│  │                    - Background process cleanup            │ │
│  │                    - Integration with all services         │ │
│  │                    - Real-time data validation             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Integration Tests                       │ │
│  │              (bootstrap.integration.test.ts)               │ │
│  │                    - Service interactions                  │ │
│  │                    - Middleware chains                     │ │
│  │                    - Database operations                   │ │
│  │                    - Cache performance                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Unit Tests                            │ │
│  │                    - Controllers                           │ │
│  │                    - Middleware                            │ │
│  │                    - Utilities                             │ │
│  │                    - Adapters                              │ │
│  │                    - Cache layers                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Performance Tests                        │ │
│  │              (bootstrap.performance.test.ts)               │ │
│  │                    - Response time validation              │ │
│  │                    - Cache performance                     │ │
│  │                    - CI robustness                         │ │
│  │                    - Memory leak detection                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Background Process Management Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKGROUND PROCESS LIFECYCLE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   Controller    │    │      App        │    │    Test     │  │
│  │                 │    │                 │    │             │  │
│  │ • Start Process │    │ • Store Ctrl    │    │ • Create    │  │
│  │ • Cleanup       │    │ • Expose        │    │ • Cleanup   │  │
│  │ • Reset State   │    │   Cleanup       │    │ • Verify    │  │
│  │ • Clear Timers  │    │ • Lifecycle     │    │ • Assert    │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
│           │                       │                   │         │
│           ▼                       ▼                   ▼         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    CLEANUP PATTERN                         │ │
│  │                                                            │ │
│  │  • setInterval → stored → cleared in cleanup               │ │
│  │  • setTimeout → stored → cleared in cleanup                │ │
│  │  • WebSocket → stored → closed in cleanup                  │ │
│  │  • Database → stored → closed in cleanup                   │ │
│  │  • Cache → stored → cleared in cleanup                     │ │
│  │  • Metrics → stored → stopped in cleanup                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Testing Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD INTEGRATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   GitHub        │    │   Jest Test     │    │   Quality    │ │
│  │   Actions       │    │   Runner        │    │   Gates      │ │
│  │                 │    │                 │    │              │ │
│  │ • Type Check    │    │ • Unit Tests    │    │ • Coverage   │ │
│  │ • Linting       │    │ • Integration   │    │ • Performance│ │
│  │ • Testing       │    │ • E2E Tests     │    │ • Security   │ │
│  │ • Build         │    │ • Performance   │    │ • Standards  │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                   │         │
│           ▼                       ▼                   ▼         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    TEST EXECUTION FLOW                     │ │
│  │                                                            │ │
│  │  1. Pre-test Setup (mocks, data, environment)              │ │
│  │  2. Test Execution (with proper lifecycle)                 │ │
│  │  3. Post-test Cleanup (resources, timers, connections)     │ │
│  │  4. Result Validation (assertions, coverage, performance)  │ │
│  │  5. Resource Release (memory, handles, intervals)          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Testing Standards & Patterns

### **Test Types & Responsibilities**
- **Unit Tests**: Individual functions, isolated components, mock dependencies
- **Integration Tests**: Service interactions, middleware chains, data flows
- **E2E Tests**: Complete workflows, real-time data, background processes
- **Performance Tests**: Response times, cache efficiency, memory usage

### **Background Process Management**
- **Pattern**: All background processes must implement cleanup methods
- **Storage**: Controllers store process references for test access
- **Lifecycle**: Apps expose cleanup methods for test coordination
- **Verification**: Tests verify complete resource cleanup

### **Quality Gates**
- **Coverage**: Unit tests ≥ 85%, integration tests 100%, E2E tests critical paths
- **Performance**: Response times within SLOs, no memory leaks, proper cleanup
- **Reliability**: Deterministic tests, no external dependencies, proper mocking
- **Integration**: CI/CD pipeline integration, automated quality checks

## Integration Points

### **With Development Workflow**
- **Before Development**: Review testing patterns and requirements
- **During Development**: Write tests alongside implementation
- **After Development**: Verify all tests pass and coverage maintained

### **With CI/CD Pipeline**
- **Automated Testing**: All tests run on every commit
- **Quality Validation**: Coverage, performance, and security gates
- **Deployment Gates**: Tests must pass before deployment

### **With System Architecture**
- **Background Processes**: All must implement cleanup patterns
- **Service Integration**: Tests validate service interactions
- **Data Flows**: Tests verify data transformation and caching

## Key Principles

1. **Cleanup First**: Design cleanup methods before implementing background processes
2. **Test Isolation**: Each test runs in isolation with proper setup/teardown
3. **Resource Management**: All resources properly allocated and released
4. **Performance Validation**: Tests verify performance characteristics
5. **CI Integration**: All tests integrate seamlessly with CI/CD pipeline

---

**Note**: For detailed implementation guidance, testing patterns, and developer checklists, see `docs/testing-standards-checklist.md`.
