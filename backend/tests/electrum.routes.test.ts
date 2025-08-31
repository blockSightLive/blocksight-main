import request from 'supertest';
import { createApp } from '../src/app';
import { Application } from 'express';

describe.skip('Electrum Routes (fake adapter)', () => {
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

  it('GET /api/v1/electrum/health returns ok:true from adapter', async () => {
    const res = await request(app).get('/api/v1/electrum/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('ts');
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toHaveProperty('electrum');
    expect(res.body.details).toHaveProperty('core');
  });

  it('GET /api/v1/electrum/fee/estimate returns three tiers', async () => {
    const res = await request(app).get('/api/v1/electrum/fee/estimate');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fast');
    expect(res.body).toHaveProperty('normal');
    expect(res.body).toHaveProperty('slow');
  });
});