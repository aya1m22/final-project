const request = require('supertest');
import app from '../index';

describe('Product API', () => {
  it('returns product list with pagination', async () => {
    const res = await request(app).get('/api/products').query({ page: 1, limit: 5 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(5);
    expect(res.body).toHaveProperty('total');
  });

  it('returns a single product by id', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title');
  });

  it('returns 404 for a missing product id', async () => {
    const res = await request(app).get('/api/products/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Not found');
  });

  it('returns category list', async () => {
    const res = await request(app).get('/api/products/categories/list');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('categories');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });
});
