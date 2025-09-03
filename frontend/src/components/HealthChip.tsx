/**
 * @fileoverview Health chip showing API health and WS ping latency
 * @description Colors: green (<300ms), amber (300–1500ms), red (degraded/failed)
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMainOrchestrator } from '../contexts/MainOrchestrator'

type ChipColor = 'green' | 'amber' | 'red'

export const HealthChip: React.FC = () => {
  const { t } = useTranslation()
  const { state } = useMainOrchestrator()
  const [apiHealthy, setApiHealthy] = useState<boolean>(false)
  const [wsLatencyMs, setWsLatencyMs] = useState<number | null>(null)
  const [electrumStatus, setElectrumStatus] = useState<'ok' | 'degraded' | 'disabled'>('degraded')
  const [coreStatus, setCoreStatus] = useState<'ok' | 'degraded' | 'disabled'>('disabled')
  const wsRef = useRef<WebSocket | null>(null)

  // Real health check - ping backend services directly
  useEffect(() => {
    let mounted = true
    const checkBackendHealth = async () => {
      if (!mounted) return
      
      try {
        // Check backend health endpoint with timeout using AbortController
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // Reduced timeout for staging
        
        const response = await fetch('/api/v1/bootstrap', {
          method: 'GET',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const bootstrapData = await response.json()
          // Bootstrap endpoint returns: { ok: true, data: { services: { electrum: boolean, core: boolean }, readiness: { details: { electrum: string, core: string } } } }
          if (bootstrapData.ok && bootstrapData.data) {
            const services = bootstrapData.data.services
            const readiness = bootstrapData.data.readiness?.details
            
            const electrumHealthy = services?.electrum === true
            const coreHealthy = services?.core === true
            const systemReady = bootstrapData.data.systemReady === true
            
            setApiHealthy(systemReady && electrumHealthy && coreHealthy)
            setCoreStatus(coreHealthy ? 'ok' : (readiness?.core === 'unavailable' ? 'disabled' : 'degraded'))
            setElectrumStatus(electrumHealthy ? 'ok' : (readiness?.electrum === 'unavailable' ? 'disabled' : 'degraded'))
          } else {
            setApiHealthy(false)
            setCoreStatus('degraded')
            setElectrumStatus('degraded')
          }
        } else {
          setApiHealthy(false)
          setCoreStatus('degraded')
          setElectrumStatus('degraded')
        }
      } catch (error) {
        // Backend not reachable - set to disabled for staging environment
        setApiHealthy(false)
        setCoreStatus('disabled')
        setElectrumStatus('disabled')
      }
    }
    
    checkBackendHealth()
    const id = setInterval(checkBackendHealth, 15000) // Check every 15 seconds (less frequent for staging)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  // WS ping/pong latency – open a lightweight ad-hoc socket for precise timing
  useEffect(() => {
    // Only measure if backend is reachable; avoid interfering with main context socket
    if (!apiHealthy) {
      setWsLatencyMs(null)
      return
    }
    
    try {
      wsRef.current = new WebSocket((import.meta as { env?: { VITE_WEBSOCKET_URL?: string } }).env?.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws')
      const ws = wsRef.current
      let lastPing = 0
      let pingInterval: NodeJS.Timeout | null = null
      
      const ping = () => {
        if (ws.readyState === WebSocket.OPEN) {
          lastPing = Date.now()
          ws.send(JSON.stringify({ type: 'ping' }))
        }
      }
      
      ws.onopen = () => {
        ping()
        pingInterval = setInterval(ping, 10000)
      }
      
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          if (msg?.type === 'pong') {
            setWsLatencyMs(Date.now() - lastPing)
          }
        } catch { /* Ignore message parsing errors */ }
      }
      
      ws.onerror = () => {
        setWsLatencyMs(null)
      }
      
      ws.onclose = () => {
        setWsLatencyMs(null)
        if (pingInterval) {
          clearInterval(pingInterval)
        }
      }
      
      return () => { 
        try { 
          if (pingInterval) clearInterval(pingInterval)
          ws.close(1000, 'cleanup') 
        } catch { /* Ignore close errors */ } 
      }
    } catch {
      setWsLatencyMs(null)
    }
  }, [apiHealthy])

  const color: ChipColor = useMemo(() => {
    // Only green when REST is healthy AND WS has opened at least once
    if (!apiHealthy) return 'red'
    if (!state.websocket.connected) return 'amber'
    if (wsLatencyMs === null) return 'amber'
    if (wsLatencyMs < 300) return 'green'
    if (wsLatencyMs <= 1500) return 'amber'
    return 'red'
  }, [apiHealthy, state.websocket.connected, wsLatencyMs])

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


