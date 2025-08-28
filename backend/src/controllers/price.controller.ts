/**
 * @fileoverview Bitcoin Price controller with provider fallback and L1 cache
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Request, Response } from 'express'
import type { L1Cache } from '../cache/l1'
import { keys } from '../cache/keys'
import { recordCacheHit, recordCacheMiss, recordLatency } from '../metrics/metrics'

type ProviderName = 'coindesk' | 'coingecko'

async function fetchCoindeskUSD(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json', { method: 'GET' })
    if (!res.ok) return null
    const json = (await res.json()) as any
    const n = Number(json?.bpi?.USD?.rate_float ?? json?.bpi?.USD?.rate)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

async function fetchCoingeckoUSD(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', { method: 'GET' })
    if (!res.ok) return null
    const json = (await res.json()) as any
    const n = Number(json?.bitcoin?.usd)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export function makePriceController(l1?: L1Cache) {
  return {
    current: async (req: Request, res: Response) => {
      const started = Date.now()
      try {
        const fiat = (String(req.query.fiat || 'USD')).toUpperCase()
        if (fiat !== 'USD') {
          // For MVP, only USD supported; extend later with conversion
          return res.status(400).json({ error: 'unsupported_fiat', supported: ['USD'] })
        }
        const cacheKey = keys.priceCurrent(fiat)
        if (l1) {
          const cached = l1.get<any>(cacheKey)
          if (cached) {
            recordCacheHit('price.current', cacheKey)
            recordLatency('price.current', Date.now() - started)
            return res.json(cached)
          }
        }

        // Provider priority: coindesk → coingecko
        let provider: ProviderName | null = null
        let value: number | null = await fetchCoindeskUSD()
        provider = value !== null ? 'coindesk' : null
        if (value === null) {
          value = await fetchCoingeckoUSD()
          provider = value !== null ? 'coingecko' : null
        }

        if (value === null || provider === null) {
          recordLatency('price.current', Date.now() - started)
          return res.status(503).json({ error: 'price_unavailable' })
        }

        const payload = {
          currency: 'BTC',
          fiat,
          value,
          asOfMs: Date.now(),
          provider
        }
        // Cache 30–60s; choose 45s as a balanced default
        if (l1) l1.set(cacheKey, payload, 45)
        recordCacheMiss('price.current', cacheKey)
        recordLatency('price.current', Date.now() - started)
        return res.json(payload)
      } catch {
        recordLatency('price.current', Date.now() - started)
        return res.status(503).json({ error: 'price_unavailable' })
      }
    }
  }
}


