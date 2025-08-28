/**
 * @fileoverview Express app wiring: middlewares and routes
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import { FakeElectrumAdapter } from './adapters/electrum/fake.adapter';
import { RealElectrumAdapter } from './adapters/electrum/electrum.adapter';
import { createElectrumRouter } from './routes/electrum.routes';
import { createCoreRouter } from './routes/core.routes';
import { createBootstrapRouter } from './routes/bootstrap.routes';
import { createPriceRouter } from './routes/price.routes';
import { createFxRouter } from './routes/fx.routes';
import { createWebSocketHub } from './ws/hub';
import { RealCoreRpcAdapter } from './adapters/core/core.adapter';
import { InMemoryL1Cache } from './cache/l1';
import { RedisL1Cache } from './cache/redis';

export function createApp(): Express {
  const app = express();

  // CORS for local dev. If FRONTEND_ORIGIN/CORS_ORIGIN is set, use it; otherwise reflect request origin.
  const allowedOrigin = process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN;
  const corsOptions = allowedOrigin ? { origin: allowedOrigin } : { origin: true };
  app.use(cors(corsOptions));
  // Ensure preflight requests receive CORS headers without using '*' pattern (Express 5 path-to-regexp v6)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const originHeader = allowedOrigin || (req.headers.origin as string) || '*';
    res.header('Access-Control-Allow-Origin', originHeader);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    const reqHeaders = (req.headers['access-control-request-headers'] as string) || 'Content-Type, Authorization';
    res.header('Access-Control-Allow-Headers', reqHeaders);
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true, ts: Date.now() });
  });

  // Expose minimal in-process metrics snapshot (non-prom format) for dev validation
  app.get('/metrics', (_req: Request, res: Response) => {
    try {
      // Lazy import to avoid cycles
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getSnapshot } = require('./metrics/metrics');
      res.json({ ok: true, ts: Date.now(), metrics: getSnapshot() });
    } catch {
      res.status(500).json({ ok: false });
    }
  });

  // Core RPC adapter (optional) – env-driven
  const coreEnabled = (process.env.CORE_ENABLED ?? 'false') === 'true';
  const coreAdapter = coreEnabled
    ? new RealCoreRpcAdapter({
        url: process.env.CORE_RPC_URL ?? 'http://192.168.1.67:8332',
        username: process.env.CORE_RPC_USER ?? 'bitcoin',
        password: process.env.CORE_RPC_PASSWORD ?? process.env.CORE_RPC_PASS ?? 'bitcoin'
      })
    : null;

  // Electrum routes - env-driven switch
  const useReal = process.env.ELECTRUM_ENABLED === 'true';
  const electrumAdapter = useReal
    ? new RealElectrumAdapter({
        host: process.env.ELECTRUM_HOST ?? 'host.docker.internal',
        port: parseInt(process.env.ELECTRUM_PORT ?? '50001', 10),
        tls: (process.env.ELECTRUM_TLS ?? 'false') === 'true'
      })
    : new FakeElectrumAdapter();
  // L1 cache (Redis preferred, fallback to in-memory)
  const l1Cache = process.env.REDIS_URL ? new RedisL1Cache(process.env.REDIS_URL) : new InMemoryL1Cache();
  // Mount routers by responsibility
  app.use('/api/v1', createElectrumRouter(electrumAdapter, coreAdapter ?? undefined, l1Cache));
  if (coreAdapter) app.use('/api/v1', createCoreRouter(coreAdapter, l1Cache));
  app.use('/api/v1', createBootstrapRouter(electrumAdapter, coreAdapter ?? undefined, l1Cache));
  app.use('/api/v1', createPriceRouter(l1Cache));
  app.use('/api/v1', createFxRouter(l1Cache));

  // Initialize WebSocket hub (will be bound to HTTP server in server.ts)
  // We attach it to app locals to access from server.ts
  app.locals.wsHub = createWebSocketHub({ adapter: electrumAdapter, core: coreAdapter ?? undefined, l1: l1Cache });

  // Basic error handler placeholder
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  });

  return app;
}

