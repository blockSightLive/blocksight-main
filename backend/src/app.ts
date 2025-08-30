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
import { createWebSocketHub } from './ws/hub';

export function createApp(): Express {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true, ts: Date.now() });
  });

  // Electrum routes - env-driven switch
  const useReal = process.env.ELECTRUM_ENABLED === 'true';
  const electrumAdapter = useReal
    ? new RealElectrumAdapter({
        host: process.env.ELECTRUM_HOST ?? 'host.docker.internal',
        port: parseInt(process.env.ELECTRUM_PORT ?? '50001', 10),
        tls: (process.env.ELECTRUM_TLS ?? 'false') === 'true'
      })
    : new FakeElectrumAdapter();
  app.use('/api/v1', createElectrumRouter(electrumAdapter));

  // Create and attach WebSocket hub
  const wsHub = createWebSocketHub({ adapter: electrumAdapter });
  app.locals.wsHub = wsHub;

  // Basic error handler placeholder
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  });

  return app;
}

