import request from 'supertest';
import { createApp } from '../src/app';

describe('Electrum Routes (fake adapter)', () => {
  it('GET /v1/health returns ok:true from adapter', async () => {
    const app = createApp();
    const res = await request(app).get('/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET /v1/fee/estimates returns three tiers', async () => {
    const app = createApp();
    const res = await request(app).get('/v1/fee/estimates');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fast');
    expect(res.body).toHaveProperty('normal');
    expect(res.body).toHaveProperty('slow');
  });
});


