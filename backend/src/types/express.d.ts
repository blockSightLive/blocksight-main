/**
 * @fileoverview Express.js type extensions for BlockSight
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Type extensions for Express.js to support custom properties
 * like requestId that are added by middleware
 * 
 * @dependencies
 * - @types/express
 */

declare global {
  namespace Express {
    interface Request {
      requestId?: string
    }
  }
}

export {}
