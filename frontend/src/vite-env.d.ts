/**
 * @fileoverview Vite environment type definitions
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-18
 * @lastModified 2025-08-18
 * 
 * @description
 * Type definitions for Vite environment variables and import.meta
 * 
 * @dependencies
 * - Vite
 * - TypeScript
 * 
 * @usage
 * Provides TypeScript support for Vite environment variables
 * 
 * @state
 * ✅ Functional - Complete Vite environment types
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add more environment variable types as needed
 * 
 * @performance
 * - No runtime impact
 * - TypeScript compilation only
 * 
 * @security
 * - Type-safe environment variable access
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
