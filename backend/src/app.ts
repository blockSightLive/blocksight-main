/**
 * @fileoverview Express app wiring: middlewares and routes
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-30
 * @state In Development
 */

import express, { Request, Response, Express } from 'express';
import { FakeElectrumAdapter } from './adapters/electrum/fake.adapter';
import { RealElectrumAdapter } from './adapters/electrum/electrum.adapter';
import { createElectrumRouter } from './routes/electrum.routes';
import { createCoreRouter } from './routes/core.routes';
import { RealCoreRpcAdapter } from './adapters/core/core.adapter';
import { createWebSocketHub } from './ws/hub';
import { 
  publicRateLimit, 
  coreRateLimit, 
  healthRateLimit, 
  globalRateLimit,
  errorHandler,
  MetricsMiddleware,
  SecurityMiddleware,
  CacheUtilities
} from './middleware';
import { createBootstrapRouter } from './routes/bootstrap.routes';
import { InMemoryL1Cache } from './cache/l1';

export async function createApp(): Promise<Express> {
  const app = express();

  // Enhanced security middleware (replaces basic CORS)
  app.use(SecurityMiddleware.helmet);
  app.use(SecurityMiddleware.cors);
  app.use(SecurityMiddleware.comprehensive);

  // Add request ID middleware for tracking
  app.use(errorHandler.requestId);

  // Add metrics collection middleware early to capture all requests
  app.use(MetricsMiddleware.collect);

  // Body parsing middleware for POST requests
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Apply global rate limiting to all routes
  app.use(globalRateLimit);

  // Health check endpoint with specific rate limiting
  app.get('/health', healthRateLimit, (_req: Request, res: Response) => {
    res.json({ ok: true, ts: Date.now() });
  });

  // Electrum routes - env-driven switch with rate limiting
  const useReal = process.env.ELECTRUM_ENABLED === 'true';
  const electrumAdapter = useReal
    ? new RealElectrumAdapter({
        host: process.env.ELECTRUM_HOST ?? 'host.docker.internal',
        port: parseInt(process.env.ELECTRUM_PORT ?? '50001', 10),
        tls: (process.env.ELECTRUM_TLS ?? 'false') === 'true'
      })
    : new FakeElectrumAdapter();
  app.use('/api/v1/electrum', publicRateLimit, createElectrumRouter(electrumAdapter));

  // Core routes - Bitcoin Core RPC integration with rate limiting
  const coreAdapter = new RealCoreRpcAdapter({
    url: process.env.CORE_RPC_URL ?? 'http://localhost:8332',
    username: process.env.CORE_RPC_USERNAME ?? 'rpcuser',
    password: process.env.CORE_RPC_PASSWORD ?? 'rpcpassword'
  });

  // Bootstrap service - System-level orchestration (gateway to backend readiness)
  const l1Cache = new InMemoryL1Cache();
  
  // Create bootstrap router asynchronously
  const bootstrapRouter = await createBootstrapRouter(electrumAdapter, coreAdapter, l1Cache);
  app.use('/api/v1/bootstrap', bootstrapRouter);

  // Electrum routes - Blockchain data and real-time updates
  app.use('/api/v1/electrum', publicRateLimit, createElectrumRouter(electrumAdapter, coreAdapter, l1Cache));

  app.use('/api/v1/core', coreRateLimit, createCoreRouter(coreAdapter));

  // Network routes - System health and status with rate limiting
  app.get('/api/v1/network/health', publicRateLimit, async (_req: Request, res: Response) => {
    try {
      const electrumStatus = await electrumAdapter.isConnected();
      res.json({ 
        ok: true, 
        services: {
          electrum: electrumStatus,
          core: true, // Core adapter always available
          websocket: true
        },
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(503).json({ 
        ok: false, 
        error: 'health_check_failed',
        services: {
          electrum: false,
          core: true,
          websocket: true
        },
        timestamp: Date.now()
      });
    }
  });

  // Create and attach WebSocket hub
  const wsHub = createWebSocketHub({ adapter: electrumAdapter });
  app.locals.wsHub = wsHub;

  // Metrics endpoints
  app.get('/metrics', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(MetricsMiddleware.export());
  });

  app.get('/api/v1/metrics/health', (req: Request, res: Response) => {
    res.json(MetricsMiddleware.health());
  });

  // Cache management endpoints
  app.get('/api/v1/cache/stats', async (req: Request, res: Response) => {
    try {
      const stats = await CacheUtilities.stats.getStats();
      res.json({
        ok: true,
        data: stats,
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: 'cache_stats_error',
        message: 'Failed to get cache statistics',
        timestamp: Date.now()
      });
    }
  });

  app.post('/api/v1/cache/invalidate/:service', async (req: Request, res: Response) => {
    try {
      const { service } = req.params;
      const deleted = await CacheUtilities.invalidator.invalidateService(service as 'electrum' | 'core' | 'network');
      res.json({
        ok: true,
        data: { deleted, service },
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: 'cache_invalidation_error',
        message: 'Failed to invalidate cache',
        timestamp: Date.now()
      });
    }
  });

  app.post('/api/v1/cache/invalidate-all', async (req: Request, res: Response) => {
    try {
      const deleted = await CacheUtilities.invalidator.invalidateAll();
      res.json({
        ok: true,
        data: { deleted },
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: 'cache_invalidation_error',
        message: 'Failed to invalidate all cache',
        timestamp: Date.now()
      });
    }
  });

  // 404 handler for unmatched routes
  app.use(errorHandler.notFound);

  // Comprehensive error handling middleware
  app.use(errorHandler.middleware);

  return app;
}

