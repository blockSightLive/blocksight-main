/**
 * @fileoverview Jest configuration for frontend testing
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-18
 * @lastModified 2025-08-18
 * 
 * @description
 * Jest configuration for React frontend testing with TypeScript support
 * 
 * @dependencies
 * - Jest
 * - React Testing Library
 * - TypeScript
 * 
 * @usage
 * Configure Jest for frontend testing
 * 
 * @state
 * ✅ Functional - Complete Jest configuration
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add coverage reporting
 * - Configure test environment
 * 
 * @performance
 * - Fast test execution
 * - Efficient test isolation
 * 
 * @security
 * - Safe test environment
 * - No production data in tests
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
