/**
 * @fileoverview Health chip showing API health and WS ping latency
 * @description Colors: green (<300ms), amber (300–1500ms), red (degraded/failed)
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBitcoin } from '../contexts/BitcoinContext'
import { useBitcoinAPI } from '../hooks/useBitcoinAPI'

type ChipColor = 'green' | 'amber' | 'red'

export const HealthChip: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useBitcoin()
  const { checkHealth } = useBitcoinAPI()
  const [apiHealthy, setApiHealthy] = useState<boolean>(false)
  const [wsLatencyMs, setWsLatencyMs] = useState<number | null>(null)
  const [electrumStatus, setElectrumStatus] = useState<'ok' | 'degraded' | 'disabled'>('degraded')
  const [coreStatus, setCoreStatus] = useState<'ok' | 'degraded' | 'disabled'>('disabled')
  const wsRef = useRef<WebSocket | null>(null)

  // Periodically check REST health
  useEffect(() => {
    let mounted = true
    const tick = async () => {
      const res = await checkHealth()
      if (!mounted) return
      setApiHealthy(res.healthy)
      const details: { electrum?: string; core?: string } = (res as { details?: { electrum?: string; core?: string } }).details || {}
      if (details.electrum) setElectrumStatus(details.electrum as 'ok' | 'degraded' | 'disabled')
      if (details.core) setCoreStatus(details.core as 'ok' | 'degraded' | 'disabled')
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => { mounted = false; clearInterval(id) }
  }, [checkHealth])

  // WS ping/pong latency – open a lightweight ad-hoc socket for precise timing
  useEffect(() => {
    // Only measure if backend is reachable; avoid interfering with main context socket
    try {
      wsRef.current = new WebSocket((import.meta as { env?: { VITE_WEBSOCKET_URL?: string } }).env?.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws')
      const ws = wsRef.current
      let lastPing = 0
      const ping = () => {
        if (ws.readyState === WebSocket.OPEN) {
          lastPing = Date.now()
          ws.send(JSON.stringify({ type: 'ping' }))
        }
      }
      ws.onopen = () => {
        ping()
        setInterval(ping, 10000)
      }
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          if (msg?.type === 'pong') {
            setWsLatencyMs(Date.now() - lastPing)
          }
        } catch { /* Ignore message parsing errors */ }
      }
      return () => { try { ws.close(1000, 'cleanup') } catch { /* Ignore close errors */ } }
    } catch {
      setWsLatencyMs(null)
    }
  }, [])

  const color: ChipColor = useMemo(() => {
    // Only green when REST is healthy AND WS has opened at least once
    if (!apiHealthy) return 'red'
    if (!state.networkStatus.isOnline) return 'amber'
    if (wsLatencyMs === null) return 'amber'
    if (wsLatencyMs < 300) return 'green'
    if (wsLatencyMs <= 1500) return 'amber'
    return 'red'
  }, [apiHealthy, state.networkStatus.isOnline, wsLatencyMs])

  const style: React.CSSProperties = useMemo(() => ({
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: color === 'green' ? '#064e3b' : color === 'amber' ? '#78350f' : '#7f1d1d',
    color: color === 'green' ? '#6ee7b7' : color === 'amber' ? '#fbbf24' : '#fca5a5',
    border: '1px solid rgba(255,255,255,0.12)'
  }), [color])

  const title = `${t('bitcoin.network.title')}: ${apiHealthy ? t('status.healthy') : t('status.degraded')} | ${t('network.wsLatency')}: ${wsLatencyMs ?? '—'} ms | electrum: ${electrumStatus} | core: ${coreStatus}`

  const dot = (status: 'ok' | 'degraded' | 'disabled') => {
    const color = status === 'ok' ? '#22c55e' : status === 'degraded' ? '#f59e0b' : '#6b7280'
    const border = status === 'ok' ? '#14532d' : status === 'degraded' ? '#7c2d12' : '#374151'
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: color, border: `1px solid ${border}`, marginLeft: 6 }} aria-label={`status ${status}`}></span>
  }

  return (
    <span style={style} title={title} aria-label={title}>
      {apiHealthy ? t('status.healthy').toUpperCase() : t('status.degraded').toUpperCase()} {wsLatencyMs !== null ? `${wsLatencyMs}ms` : ''}
      {dot(electrumStatus)}
      {dot(coreStatus)}
    </span>
  )
}

export default HealthChip


