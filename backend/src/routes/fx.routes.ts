/**
 * @fileoverview FX routes (USD base)
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Router } from 'express'
import type { L1Cache } from '../cache/l1'
import { makeFxController } from '../controllers/fx.controller'

export function createFxRouter(l1?: L1Cache): Router {
  const r = Router()
  const c = makeFxController(l1)
  r.get('/', (_req, res) => res.json({ ok: true, routes: ['/fx/rates'] }))
  r.get('/fx/rates', c.rates)
  return r
}


