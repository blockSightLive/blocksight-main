/**
 * @fileoverview Price routes (external providers)
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Router } from 'express'
import type { L1Cache } from '../cache/l1'
import { makePriceController } from '../controllers/price.controller'

export function createPriceRouter(l1?: L1Cache): Router {
  const r = Router()
  const c = makePriceController(l1)
  r.get('/', (_req, res) => res.json({ ok: true, routes: ['/price'] }))
  r.get('/price', c.current)
  return r
}


