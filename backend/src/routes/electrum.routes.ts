/**
 * @fileoverview Electrum routes binding
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import { Router } from 'express';
import { ElectrumAdapter } from '../adapters/electrum/types';
import { makeElectrumController } from '../controllers/electrum.controller';

export function createElectrumRouter(adapter: ElectrumAdapter): Router {
  const r = Router();
  const c = makeElectrumController(adapter);

  r.get('/health', c.health);
  r.get('/fee/estimates', c.fees);

  return r;
}


