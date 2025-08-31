/**
 * @fileoverview Request validation middleware using Zod schemas for BlockSight.live API
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Implements request validation using Zod schemas for all API endpoints with proper
 * error handling and standardized error responses.
 * 
 * @dependencies
 * - Zod for schema validation
 * - Express types
 * - Error handler utilities
 * 
 * @usage
 * Apply to routes that require request validation
 * 
 * @state
 * ✅ Functional - Complete validation implementation
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add more specific schemas for different endpoints
 * - Implement custom validation rules
 * - Add validation caching for performance
 * 
 * @performance
 * - Efficient Zod validation
 * - Early rejection of invalid requests
 * 
 * @security
 * - Prevents malformed requests
 * - Input sanitization through validation
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';

// Common validation schemas
export const CommonSchemas = {
  // Pagination parameters
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
  }),

  // Bitcoin address validation
  bitcoinAddress: z.string().regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, {
    message: 'Invalid Bitcoin address format'
  }),

  // Bitcoin transaction hash validation
  transactionHash: z.string().regex(/^[a-fA-F0-9]{64}$/, {
    message: 'Invalid transaction hash format (64 character hex string)'
  }),

  // Bitcoin transaction hex validation
  transactionHex: z.string().regex(/^[a-fA-F0-9]+$/, {
    message: 'Invalid transaction hex format'
  }),

  // Block height validation
  blockHeight: z.coerce.number().int().min(0),

  // Network parameter validation
  network: z.enum(['mainnet', 'testnet', 'regtest']).default('mainnet'),

  // Timestamp validation
  timestamp: z.coerce.number().int().min(0),

  // Numeric range validation
  numericRange: z.object({
    min: z.coerce.number().optional(),
    max: z.coerce.number().optional()
  })
};

// Electrum-specific validation schemas
export const ElectrumSchemas = {
  // Get balance request
  getBalance: z.object({
    address: CommonSchemas.bitcoinAddress
  }),

  // Get transaction request
  getTransaction: z.object({
    txid: CommonSchemas.transactionHash
  }),

  // Get history request
  getHistory: z.object({
    address: CommonSchemas.bitcoinAddress,
    ...CommonSchemas.pagination.shape
  }),

  // Get mempool request
  getMempool: CommonSchemas.pagination,

  // Get fee estimate request
  getFeeEstimate: z.object({
    blocks: z.coerce.number().int().min(1).max(1000).default(6)
  })
};

// Core RPC-specific validation schemas
export const CoreSchemas = {
  // Get block request
  getBlock: z.object({
    hash: CommonSchemas.transactionHash.optional(),
    height: CommonSchemas.blockHeight.optional()
  }).refine(
    (data) => data.hash || data.height,
    { message: 'Either hash or height must be provided' }
  ),

  // Get block count request
  getBlockCount: z.object({}),

  // Get blockchain info request
  getBlockchainInfo: z.object({}),

  // Get network info request
  getNetworkInfo: z.object({}),

  // Get mempool info request
  getMempoolInfo: z.object({}),

  // Get raw transaction request
  getRawTransaction: z.object({
    txid: CommonSchemas.transactionHash,
    verbose: z.boolean().default(false)
  })
};

// Network-specific validation schemas
export const NetworkSchemas = {
  // Health check request
  health: z.object({}),

  // Status request
  status: z.object({
    service: z.enum(['electrum', 'core', 'websocket']).optional()
  })
};

// WebSocket-specific validation schemas
export const WebSocketSchemas = {
  // Subscribe to address updates
  subscribeAddress: z.object({
    address: CommonSchemas.bitcoinAddress,
    type: z.enum(['balance', 'transactions', 'mempool']).default('balance')
  }),

  // Subscribe to block updates
  subscribeBlock: z.object({
    type: z.enum(['new', 'reorg', 'all']).default('new')
  }),

  // Subscribe to mempool updates
  subscribeMempool: z.object({
    type: z.enum(['new', 'confirmed', 'all']).default('all')
  })
};

// Generic validation middleware factory
export function createValidationMiddleware<T extends ZodSchema>(
  schema: T,
  target: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
      
      // Validate the data
      const validatedData = schema.parse(data);
      
      // Replace the original data with validated data
      // Note: Using type assertion to avoid complex Express type compatibility issues
      // This is safe because we're replacing the data with validated Zod output
      if (target === 'body') {
        (req as unknown as { body: unknown }).body = validatedData;
      } else if (target === 'query') {
        (req as unknown as { query: unknown }).query = validatedData;
      } else {
        (req as unknown as { params: unknown }).params = validatedData;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Create validation error response
        const zodError = error as ZodError<unknown>;
        const validationErrors = zodError.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }));

        const errorResponse = {
          ok: false,
          error: 'validation_error',
          message: 'Validation Error',
          details: validationErrors,
          requestId: req.requestId || 'unknown',
          timestamp: Date.now()
        };

        res.status(400).json(errorResponse);
      } else {
        // Pass to general error handler
        next(error);
      }
    }
  };
}

// Specific validation middlewares for different endpoints
export const ValidationMiddleware = {
  // Electrum endpoints
  electrum: {
    getBalance: createValidationMiddleware(
      z.object({ address: CommonSchemas.bitcoinAddress }), 
      'params'
    ),
    getTransaction: createValidationMiddleware(
      z.object({ txid: CommonSchemas.transactionHash }), 
      'params'
    ),
    getHistory: createValidationMiddleware(
      z.object({ 
        address: CommonSchemas.bitcoinAddress,
        ...CommonSchemas.pagination.shape 
      }), 
      'params'
    ),
    getMempool: createValidationMiddleware(CommonSchemas.pagination, 'query'),
    getFeeEstimate: createValidationMiddleware(
      z.object({ blocks: z.coerce.number().int().min(1).max(1000).default(6) }), 
      'query'
    )
  },

  // Core RPC endpoints
  core: {
    getBlock: createValidationMiddleware(CoreSchemas.getBlock, 'query'),
    getBlockCount: createValidationMiddleware(CoreSchemas.getBlockCount, 'query'),
    getBlockchainInfo: createValidationMiddleware(CoreSchemas.getBlockchainInfo, 'query'),
    getNetworkInfo: createValidationMiddleware(CoreSchemas.getNetworkInfo, 'query'),
    getMempoolInfo: createValidationMiddleware(CoreSchemas.getMempoolInfo, 'query'),
    getRawTransaction: createValidationMiddleware(CoreSchemas.getRawTransaction, 'query')
  },

  // Network endpoints
  network: {
    health: createValidationMiddleware(NetworkSchemas.health, 'query'),
    status: createValidationMiddleware(NetworkSchemas.status, 'query')
  },

  // WebSocket endpoints
  websocket: {
    subscribeAddress: createValidationMiddleware(WebSocketSchemas.subscribeAddress, 'body'),
    subscribeBlock: createValidationMiddleware(WebSocketSchemas.subscribeBlock, 'body'),
    subscribeMempool: createValidationMiddleware(WebSocketSchemas.subscribeMempool, 'body')
  },

  // Generic validation
  generic: {
    pagination: createValidationMiddleware(CommonSchemas.pagination, 'query'),
    bitcoinAddress: createValidationMiddleware(
      z.object({ address: CommonSchemas.bitcoinAddress }), 
      'query'
    ),
    transactionHash: createValidationMiddleware(
      z.object({ txid: CommonSchemas.transactionHash }), 
      'query'
    )
  }
};

// Export all schemas and middleware
export const ValidationSchemas = {
  Common: CommonSchemas,
  Electrum: ElectrumSchemas,
  Core: CoreSchemas,
  Network: NetworkSchemas,
  WebSocket: WebSocketSchemas
};

export default ValidationMiddleware;
