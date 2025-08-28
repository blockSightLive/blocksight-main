/**
 * @fileoverview Bootstrap routes (orchestration-only)
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Router } from 'express'
import { makeBootstrapController } from '../controllers/bootstrap.controller'
import type { ElectrumAdapter } from '../adapters/electrum/types'
import type { CoreRpcAdapter } from '../adapters/core/types'
import type { L1Cache } from '../cache/l1'

export function createBootstrapRouter(adapter: ElectrumAdapter, core?: CoreRpcAdapter, l1?: L1Cache): Router {
  const r = Router()
  const b = makeBootstrapController({ adapter, core, l1 })
  r.get('/', (_req, res) => res.json({ ok: true, routes: ['/bootstrap'] }))
  r.get('/bootstrap', b.bootstrap)
  return r
}


