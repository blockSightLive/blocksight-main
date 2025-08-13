/**
 * @fileoverview Express app wiring: middlewares and routes
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import express, { Request, Response, NextFunction, Express } from 'express';
import { FakeElectrumAdapter } from './adapters/electrum/fake.adapter';
import { createElectrumRouter } from './routes/electrum.routes';

export function createApp(): Express {
  const app = express();

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true, ts: Date.now() });
  });

  // Electrum routes (using fake adapter by default; real adapter wired later)
  const electrumAdapter = new FakeElectrumAdapter();
  app.use('/v1', createElectrumRouter(electrumAdapter));

  // Basic error handler placeholder
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  });

  return app;
}

