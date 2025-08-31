import request from 'supertest';
import { createApp } from '../src/app';
import { Application } from 'express';

/**
 * @fileoverview Health endpoint E2E tests
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * @state ✅ Complete - Health endpoint testing
 * 
 * @description
 * End-to-end tests for the health endpoint, ensuring proper cleanup
 * of background processes (BackgroundHealthMonitor intervals) to prevent
 * Jest from hanging with open handles.
 * 
 * @fixes
 * - BackgroundHealthMonitor setInterval cleanup in tests
 * - Jest open handle prevention
 * - Proper app lifecycle management
 */

describe('GET /health', () => {
  let app: Application & { cleanup?: () => Promise<void> };

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    // Clean up any background processes
    if (app && app.cleanup) {
      await app.cleanup();
    }
  });

  afterAll(async () => {
    // Ensure all timers are cleared
    jest.clearAllTimers();
  });

  it('returns ok: true', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});


