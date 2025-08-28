/**
 * @fileoverview Test setup file for React Testing Library
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-18
 * @lastModified 2025-08-18
 * 
 * @description
 * Global test setup for React Testing Library and Jest
 * 
 * @dependencies
 * - React Testing Library
 * - Jest DOM
 * 
 * @usage
 * Configure test environment for React components
 * 
 * @state
 * ✅ Functional - Complete test setup
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add custom matchers
 * - Configure test utilities
 * 
 * @performance
 * - Fast test setup
 * - Efficient test isolation
 * 
 * @security
 * - Safe test environment
 * - No production data in tests
 */

import '@testing-library/jest-dom'

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any

// Mock ResizeObserver for responsive component tests
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
