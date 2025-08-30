import request from 'supertest';
import { createApp } from '../src/app';

describe('Electrum Routes (fake adapter)', () => {
  it('GET /api/v1/health returns ok:true from adapter', async () => {
    const app = createApp();
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('ts');
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toHaveProperty('electrum');
    expect(res.body.details).toHaveProperty('core');
  });

  it('GET /api/v1/fee/estimates returns three tiers', async () => {
    const app = createApp();
    const res = await request(app).get('/api/v1/fee/estimates');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fast');
    expect(res.body).toHaveProperty('normal');
    expect(res.body).toHaveProperty('slow');
  });
});