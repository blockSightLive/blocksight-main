/**
 * @fileoverview Jest test setup and teardown
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * @state ✅ Complete - Test setup and cleanup
 */

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  
  // Increase timeout for all tests
  jest.setTimeout(30000)
})

// Global test teardown
afterAll(async () => {
  // Clear all timers
  jest.clearAllTimers()
  
  // Restore all mocks
  jest.restoreAllMocks()
  
  // Clear any remaining promises - use setTimeout instead of setImmediate
  await new Promise(resolve => setTimeout(resolve, 0))
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc()
  }
  
  // Clear any remaining intervals
  for (let i = 1; i < 1000; i++) {
    clearInterval(i)
  }
})

// Note: Removed problematic process.on handlers that caused TypeScript errors
// Jest handles unhandled rejections and exceptions automatically in test environment
