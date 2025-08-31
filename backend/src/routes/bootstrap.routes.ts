/**
 * @fileoverview Bootstrap routes - System-level orchestration service
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * @state ✅ Complete - System Orchestration Service
 * 
 * @description
 * Bootstrap is NOT an electrum service - it's a system-level orchestration service that:
 * - Aggregates data from multiple services (Electrum, Core RPC, Cache, etc.)
 * - Acts as the single source of truth for "backend ready" status
 * - Provides the glue between different services for frontend initialization
 * - Sits at /api/v1/bootstrap as a top-level system endpoint
 * 
 * @dependencies
 * - ElectrumAdapter for blockchain data
 * - CoreRpcAdapter for Bitcoin Core data (optional)
 * - L1Cache for performance optimization
 * - Metrics system for monitoring
 * 
 * @usage
 * Called by frontend on initial load to determine if backend is ready
 * and populate dashboard with current data from all services
 * 
 * @state
 * ✅ Complete - System Orchestration Service
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add service health monitoring
 * - Implement circuit breaker pattern
 * - Add bootstrap performance metrics
 * 
 * @performance
 * - L1 cache with 3-second TTL for high-frequency access
 * - Parallel data fetching for optimal response time
 * - Graceful degradation when services are unavailable
 * 
 * @security
 * - No sensitive data exposure
 * - Input validation on all parameters
 * - Error handling without information leakage
 */

import { Router } from 'express'
import { makeBootstrapController } from '../controllers/bootstrap.controller'
import type { ElectrumAdapter } from '../adapters/electrum/types'
import type { CoreRpcAdapter } from '../adapters/core/types'
import type { L1Cache } from '../cache/l1'

export async function createBootstrapRouter(adapter: ElectrumAdapter, core?: CoreRpcAdapter, l1?: L1Cache): Promise<Router> {
  const r = Router()
  
  // Handle optional parameters with proper defaults
  const coreAdapter = core || null
  const l1Cache = l1 || new (await import('../cache/l1')).InMemoryL1Cache()
  
  const b = makeBootstrapController({ adapter, core: coreAdapter, l1: l1Cache })
  
  // System-level bootstrap endpoint - the gateway to backend readiness
  r.get('/', b.bootstrap)
  
  // Health check for the bootstrap service itself
  r.get('/health', (_req, res) => {
    const overallStatus = 'operational'
    const services = {
      bootstrap: overallStatus,
      // Add other services here as they are monitored
    }
    res.json({ 
      ok: true, 
      service: 'bootstrap',
      status: overallStatus,
      timestamp: Date.now(),
      services,
      uptime: Date.now() - (global.startTime || Date.now()),
      version: '1.0.0'
    })
  })
  
  return r
}
