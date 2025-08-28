/**
 * @fileoverview FX Rates controller (USD base) with L1 cache
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Request, Response } from 'express'
import type { L1Cache } from '../cache/l1'
import { keys } from '../cache/keys'
import { recordCacheHit, recordCacheMiss, recordLatency } from '../metrics/metrics'

type FxProvider = 'exchangerate.host' | 'openexchangerates'

async function fetchFxUSD(symbols: string[]): Promise<{ rates: Record<string, number>; provider: FxProvider } | null> {
  const list = symbols.map(s => s.toUpperCase()).join(',')
  // Free, no‑key option; reliable enough for non-critical display
  const url = `https://api.exchangerate.host/latest?base=USD&symbols=${encodeURIComponent(list)}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const json = (await res.json()) as { rates?: Record<string, number> }
    const rates = json?.rates ?? {}
    const out: Record<string, number> = {}
    for (const sym of symbols) {
      const v = Number(rates?.[sym.toUpperCase()])
      if (Number.isFinite(v)) out[sym.toUpperCase()] = v
    }
    return { rates: out, provider: 'exchangerate.host' }
  } catch {
    return null
  }
}

export function makeFxController(l1?: L1Cache) {
  return {
    rates: async (req: Request, res: Response) => {
      const started = Date.now()
      try {
        const base = String((req.query.base || 'USD')).toUpperCase()
        if (base !== 'USD') return res.status(400).json({ error: 'unsupported_base', supported: ['USD'] })
        const symbolsParam = String(req.query.symbols || 'EUR,BRL,ARS,ILS')
        const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
        const cacheKey = keys.fxRates(base)
        if (l1) {
          const cached = l1.get<{ base: string; rates: Record<string, number>; asOfMs: number; provider: string }>(cacheKey)
          if (cached) {
            recordCacheHit('fx.rates', cacheKey)
            recordLatency('fx.rates', Date.now() - started)
            // Optionally subset to requested symbols
            const subset = { ...cached, rates: Object.fromEntries(symbols.map(s => [s, cached.rates?.[s]])) }
            return res.json(subset)
          }
        }

        const data = await fetchFxUSD(symbols)
        if (!data) {
          recordLatency('fx.rates', Date.now() - started)
          return res.status(503).json({ error: 'fx_unavailable' })
        }
        const payload = { base: 'USD', rates: data.rates, asOfMs: Date.now(), provider: data.provider }
        if (l1) l1.set(cacheKey, payload, 3600) // 1h TTL
        recordCacheMiss('fx.rates', cacheKey)
        recordLatency('fx.rates', Date.now() - started)
        return res.json(payload)
      } catch {
        recordLatency('fx.rates', Date.now() - started)
        return res.status(503).json({ error: 'fx_unavailable' })
      }
    }
  }
}


