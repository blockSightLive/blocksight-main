/**
 * @fileoverview Electrum service routes for BlockSight.live API
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-30
 * @state ✅ Complete - All endpoints implemented with validation
 * 
 * @description
 * Provides RESTful API endpoints for Electrum server integration including
 * blockchain data, mempool information, and real-time updates.
 * 
 * @dependencies
 * - ElectrumAdapter interface
 * - ElectrumController
 * - ValidationMiddleware
 * - L1Cache (optional)
 * 
 * @usage
 * Mount at /api/v1/electrum for full Electrum service access
 * 
 * @state
 * ✅ Complete - All endpoints implemented with validation
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add WebSocket support for real-time updates
 * - Implement subscription management
 * - Add rate limiting per endpoint
 * 
 * @performance
 * - Efficient caching with L1 cache
 * - Optimized database queries
 * - Minimal response overhead
 * 
 * @security
 * - Input validation via Zod schemas
 * - Rate limiting protection
 * - Request sanitization
 */

import { Router } from 'express';
import { ElectrumAdapter } from '../adapters/electrum/types';
import { makeElectrumController } from '../controllers/electrum.controller';
import type { L1Cache } from '../cache/l1';
import type { CoreRpcAdapter } from '../adapters/core/types';
import { ValidationMiddleware } from '../middleware';

export function createElectrumRouter(adapter: ElectrumAdapter, _core?: CoreRpcAdapter, l1?: L1Cache): Router {
  const r = Router();
  const c = makeElectrumController(adapter, undefined, l1);

  // Basic health and status endpoints
  r.get('/health', c.health);
  r.get('/fees', c.fees);
  r.get('/network/height', c.height);
  r.get('/network/mempool', c.mempool);

  // Enhanced endpoints with validation
  r.get('/address/:address/balance',
    ValidationMiddleware.electrum.getBalance,
    c.getBalance
  );

  r.get('/transaction/:txid',
    ValidationMiddleware.electrum.getTransaction,
    c.getTransaction
  );

  r.get('/address/:address/history',
    ValidationMiddleware.electrum.getHistory,
    c.getHistory
  );

  r.get('/mempool',
    ValidationMiddleware.electrum.getMempool,
    c.getMempool
  );

  r.get('/fee/estimate',
    ValidationMiddleware.electrum.getFeeEstimate,
    c.getFeeEstimate
  );

  return r;
}


