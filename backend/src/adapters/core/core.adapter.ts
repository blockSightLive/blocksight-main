/**
 * @fileoverview Bitcoin Core RPC adapter using fetch
 * @version 1.0.0
 * @since 2025-08-20
 * @state In Development
 */

import type { CoreMempoolSummary, CoreRpcAdapter } from './types'

type Fetch = typeof fetch

export class RealCoreRpcAdapter implements CoreRpcAdapter {
  private url: string
  private authHeader: string
  private fetchImpl: Fetch

  constructor(params: { url: string; username: string; password: string; fetchImpl?: Fetch }) {
    this.url = params.url
    const token = Buffer.from(`${params.username}:${params.password}`).toString('base64')
    this.authHeader = `Basic ${token}`
    this.fetchImpl = params.fetchImpl || fetch
  }

  private async call<T>(method: string, params: unknown[] = [], timeoutMs: number = 3000): Promise<T> {
    const body = { jsonrpc: '2.0', id: Date.now(), method, params }
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await this.fetchImpl(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.authHeader
        },
        body: JSON.stringify(body),
        signal: controller.signal
      })
      if (!res.ok) throw new Error(`Core RPC HTTP ${res.status}`)
      const json = (await res.json()) as { result?: T; error?: { code: number; message: string } }
      if (json.error) throw new Error(`Core RPC ${json.error.code}: ${json.error.message}`)
      return json.result as T
    } finally {
      clearTimeout(timeout)
    }
  }

  async getMempoolSummary(): Promise<CoreMempoolSummary> {
    // Prefer getmempoolinfo for authoritative counts and sizes
    const info = await this.call<any>('getmempoolinfo')
    return {
      pendingTransactions: typeof info?.size === 'number' ? info.size : 0,
      bytes: typeof info?.bytes === 'number' ? info.bytes : undefined,
      usage: typeof info?.usage === 'number' ? info.usage : undefined,
      minFee: typeof info?.mempoolminfee === 'number' ? info.mempoolminfee : undefined
    }
  }

  async getBlockCount(): Promise<number> {
    const count = await this.call<number>('getblockcount')
    return typeof count === 'number' ? count : 0
  }
}


