/**
 * @fileoverview Electrum controller exposing HTTP endpoints
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import { Request, Response } from 'express';
import { ElectrumAdapter } from '../adapters/electrum/types';

export function makeElectrumController(adapter: ElectrumAdapter) {
  return {
    health: async (_req: Request, res: Response) => {
      const ok = await adapter.ping();
      res.json({ ok });
    },
    fees: async (_req: Request, res: Response) => {
      const estimates = await adapter.getFeeEstimates();
      res.json(estimates);
    }
  };
}


