module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Critical: Prevent hanging tests
  testTimeout: 30000, // 30 seconds max per test
  maxWorkers: 1, // Run tests sequentially to prevent resource conflicts
  
  // Proper cleanup settings
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Global setup and teardown
  globalSetup: undefined,
  globalTeardown: undefined,
  
  // Ensure proper cleanup
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Verbose output for debugging
  verbose: true,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Prevent hanging tests
  testTimeout: 10000,
  
  // Global teardown removed - using afterAll in individual test files instead
};
