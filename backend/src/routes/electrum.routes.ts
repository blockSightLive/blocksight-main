/**
 * @fileoverview Electrum-only routes binding (Electrum-backed endpoints)
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-23
 * @state In Development
 */

import { Router } from 'express';
import { ElectrumAdapter } from '../adapters/electrum/types';
import { makeElectrumController } from '../controllers/electrum.controller';
import type { L1Cache } from '../cache/l1';
import type { CoreRpcAdapter } from '../adapters/core/types';

export function createElectrumRouter(adapter: ElectrumAdapter, _core?: CoreRpcAdapter, l1?: L1Cache): Router {
  const r = Router();
  const c = makeElectrumController(adapter, undefined, l1);

  // Introspection: confirm router is mounted
  r.get('/', (_req, res) => res.json({ ok: true, routes: ['/electrum/health', '/electrum/fee/estimates', '/electrum/network/height', '/electrum/network/mempool'] }));

  // Namespaced Electrum endpoints
  r.get('/electrum/health', c.health);
  r.get('/electrum/fee/estimates', c.fees);
  r.get('/electrum/network/height', c.height);
  r.get('/electrum/network/mempool', c.mempool);

  // Backward-compatible aliases (legacy flat paths)
  r.get('/health', c.health);
  r.get('/fee/estimates', c.fees);
  r.get('/network/height', c.height);
  r.get('/network/mempool', c.mempool);

  return r;
}


