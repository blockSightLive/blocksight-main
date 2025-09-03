/**
 * @fileoverview Real connection tests for bootstrap system
 * @version 1.0.0
 * @since 2025-01-02
 * @lastModified 2025-01-02
 * 
 * @description
 * Tests bootstrap system with real Bitcoin Core and Electrum connections.
 * These tests require actual services to be running and are meant for local development.
 * 
 * @dependencies
 * - Real Bitcoin Core node (localhost:8332)
 * - Real Electrum server (localhost:50001)
 * - Jest testing framework
 * 
 * @usage
 * Run with: npm run test:bootstrap:integration
 * 
 * @state
 * ✅ Complete - Real connection testing
 */

import { makeBootstrapController } from '../src/controllers/bootstrap.controller'
import { RealElectrumAdapter } from '../src/adapters/electrum/electrum.adapter'
import { RealCoreRpcAdapter } from '../src/adapters/core/core.adapter'
import { InMemoryL1Cache } from '../src/cache/l1'
import type { Request, Response } from 'express'

// Skip real connection tests in CI/CD environments
const shouldSkipRealConnectionTests = process.env.CI === 'true' || process.env.NODE_ENV === 'test'

const describeRealConnections = shouldSkipRealConnectionTests ? describe.skip : describe

describeRealConnections('Bootstrap Real Connections', () => {
  let electrumAdapter: RealElectrumAdapter
  let coreAdapter: RealCoreRpcAdapter
  let l1Cache: InMemoryL1Cache
  let bootstrapController: ReturnType<typeof makeBootstrapController>

  beforeAll(async () => {
    // Initialize real adapters with configurable addresses
    // Check environment variables or use defaults
    const electrumHost = process.env.ELECTRUM_HOST || '127.0.0.1'
    const electrumPort = parseInt(process.env.ELECTRUM_PORT || '50001', 10)
    const coreUrl = process.env.BITCOIN_CORE_URL || 'http://192.168.1.67:8332'
    const coreUsername = process.env.BITCOIN_CORE_USERNAME || 'blocksight'
    const corePassword = process.env.BITCOIN_CORE_PASSWORD || 'blocksight'

    console.log(`[TEST] Connecting to Electrum: ${electrumHost}:${electrumPort}`)
    console.log(`[TEST] Connecting to Bitcoin Core: ${coreUrl}`)

    electrumAdapter = new RealElectrumAdapter({
      host: electrumHost,
      port: electrumPort,
      tls: false
    })

    coreAdapter = new RealCoreRpcAdapter({
      url: coreUrl,
      username: coreUsername,
      password: corePassword
    })

    l1Cache = new InMemoryL1Cache()

    bootstrapController = makeBootstrapController({
      adapter: electrumAdapter,
      core: coreAdapter,
      l1: l1Cache
    })
  })

  afterAll(async () => {
    // Cleanup
    if (bootstrapController) {
      bootstrapController.cleanup()
    }
  })

  describe('Real Service Connections', () => {
    it('should connect to real Electrum server', async () => {
      // Test Electrum connection
      const isConnected = await electrumAdapter.isConnected()
      console.log(`Electrum connection status: ${isConnected}`)
      expect(isConnected).toBe(true)
    }, 10000) // 10 second timeout

    it('should connect to real Bitcoin Core', async () => {
      // Test Core RPC connection
      const blockCount = await coreAdapter.getBlockCount()
      console.log(`Bitcoin Core block count: ${blockCount}`)
      expect(typeof blockCount).toBe('number')
      expect(blockCount).toBeGreaterThan(0)
    }, 10000) // 10 second timeout

    it('should verify system connections through bootstrap', async () => {
      // Create mock request/response
      const mockReq = {
        method: 'GET',
        url: '/api/v1/bootstrap',
        headers: {},
        body: {},
        query: {},
        params: {}
      } as Request

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      } as unknown as Response

      // Test bootstrap endpoint
      await bootstrapController.bootstrap(mockReq, mockRes)

      // Verify response
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          data: expect.objectContaining({
            systemReady: expect.any(Boolean),
            services: expect.objectContaining({
              electrum: expect.any(Boolean),
              core: expect.any(Boolean),
              external: expect.any(Boolean),
              websocket: expect.any(Boolean)
            }),
            readiness: expect.objectContaining({
              overall: expect.stringMatching(/^(ready|degraded|unavailable)$/)
            }),
            initialization: expect.objectContaining({
              electrumConnected: expect.any(Boolean),
              coreConnected: expect.any(Boolean),
              externalAPIsConnected: expect.any(Boolean),
              websocketHubInitialized: expect.any(Boolean)
            })
          })
        })
      )
    }, 15000) // 15 second timeout

    it('should get real blockchain data from Electrum', async () => {
      const tipHeight = await electrumAdapter.getTipHeight()
      expect(typeof tipHeight).toBe('number')
      expect(tipHeight).toBeGreaterThan(0)

      const mempoolSummary = await electrumAdapter.getMempoolSummary()
      expect(typeof mempoolSummary).toBe('object')
      expect(mempoolSummary).toHaveProperty('count')
      expect(mempoolSummary).toHaveProperty('vsize')
    }, 10000)

    it('should get real blockchain data from Bitcoin Core', async () => {
      const blockCount = await coreAdapter.getBlockCount()
      expect(typeof blockCount).toBe('number')
      expect(blockCount).toBeGreaterThan(0)

      const mempoolInfo = await coreAdapter.getMempoolSummary()
      expect(typeof mempoolInfo).toBe('object')
      expect(mempoolInfo).toHaveProperty('pendingTransactions')

      const blockchainInfo = await coreAdapter.getBlockchainInfo()
      expect(typeof blockchainInfo).toBe('object')
      expect(blockchainInfo).toHaveProperty('chain')
      expect(blockchainInfo).toHaveProperty('blocks')
    }, 10000)
  })

  describe('Service Health Monitoring', () => {
    it('should report healthy status for all services', async () => {
      // Test individual service health
      const electrumHealthy = await electrumAdapter.isConnected()
      const coreHealthy = await coreAdapter.getBlockCount().then(() => true).catch(() => false)

      expect(electrumHealthy).toBe(true)
      expect(coreHealthy).toBe(true)
    }, 10000)

    it('should handle service unavailability gracefully', async () => {
      // Test with disconnected Electrum (simulate failure)
      const originalIsConnected = electrumAdapter.isConnected
      electrumAdapter.isConnected = jest.fn().mockResolvedValue(false)

      const mockReq = {
        method: 'GET',
        url: '/api/v1/bootstrap',
        headers: {},
        body: {},
        query: {},
        params: {}
      } as Request

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      } as unknown as Response

      await bootstrapController.bootstrap(mockReq, mockRes)

      // Should return degraded response, not error
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          data: expect.objectContaining({
            systemReady: false,
            readiness: expect.objectContaining({
              overall: 'degraded'
            })
          })
        })
      )

      // Restore original method
      electrumAdapter.isConnected = originalIsConnected
    }, 10000)
  })
})
