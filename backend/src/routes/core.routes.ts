/**
 * @fileoverview Core-only routes binding (Bitcoin Core backed endpoints)
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Router } from 'express'
import type { L1Cache } from '../cache/l1'
import type { CoreRpcAdapter } from '../adapters/core/types'
import { makeCoreController } from '../controllers/core.controller'

export function createCoreRouter(core: CoreRpcAdapter, l1?: L1Cache): Router {
  const r = Router()
  const c = makeCoreController(core, l1)

  r.get('/', (_req, res) => res.json({ ok: true, routes: ['/height', '/mempool'] }))
  r.get('/height', c.height)
  r.get('/mempool', c.mempool)

  return r
}


