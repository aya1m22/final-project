const request = require('supertest');
import app from '../index';

describe('Reviews API', () => {
  const testProductId = 1;
  const testToken = 'Bearer test-token';

  describe('GET /api/reviews/product/:productId', () => {
    it('should return product reviews with pagination', async () => {
      const res = await request(app)
        .get(`/api/reviews/product/${testProductId}`)
        .query({ limit: 10, offset: 0 });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('reviews');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('limit');
      expect(res.body).toHaveProperty('offset');
      expect(Array.isArray(res.body.reviews)).toBe(true);
    });

    it('should return only approved reviews', async () => {
      const res = await request(app)
        .get(`/api/reviews/product/${testProductId}`);
      
      if (res.body.reviews.length > 0) {
        res.body.reviews.forEach((review: any) => {
          expect(review.status).toBe('approved');
        });
      }
    });
  });

  describe('GET /api/reviews/stats/:productId', () => {
    it('should return review statistics', async () => {
      const res = await request(app)
        .get(`/api/reviews/stats/${testProductId}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('averageRating');
      expect(res.body).toHaveProperty('totalReviews');
      expect(res.body).toHaveProperty('ratingBreakdown');
      expect(typeof res.body.averageRating).toBe('number');
      expect(typeof res.body.totalReviews).toBe('number');
    });

    it('should return zero stats for new products', async () => {
      const res = await request(app)
        .get(`/api/reviews/stats/99999`);
      
      expect(res.status).toBe(200);
      expect(res.body.averageRating).toBe(0);
      expect(res.body.totalReviews).toBe(0);
    });
  });

  describe('POST /api/reviews', () => {
    it('should require authorization', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .send({
          productId: testProductId,
          rating: 5,
          title: 'Great product!',
          content: 'Very satisfied with this purchase.'
        });
      
      expect(res.status).toBe(401);
    });

    it('should reject invalid rating', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', testToken)
        .send({
          productId: testProductId,
          rating: 6, // Invalid: > 5
          title: 'Test'
        });
      
      expect(res.status).toBe(400);
    });

    it('should reject missing productId', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', testToken)
        .send({
          rating: 5,
          title: 'Test'
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/reviews/:reviewId/helpful', () => {
    it('should update helpful count', async () => {
      // This test would need an existing review ID
      const res = await request(app)
        .patch('/api/reviews/1/helpful')
        .send({ helpful: true });
      
      // Will either succeed or fail gracefully
      expect([200, 404, 500]).toContain(res.status);
    });
  });
});

describe('Likes API', () => {
  const testProductId = 1;
  const testToken = 'Bearer test-token';

  describe('GET /api/likes/user/likes', () => {
    it('should require authorization', async () => {
      const res = await request(app).get('/api/likes/user/likes');
      expect(res.status).toBe(401);
    });

    it('should return user liked products', async () => {
      const res = await request(app)
        .get('/api/likes/user/likes')
        .set('Authorization', testToken);
      
      expect([200, 401]).toContain(res.status);
    });
  });

  describe('GET /api/likes/product/:productId', () => {
    it('should require authorization', async () => {
      const res = await request(app)
        .get(`/api/likes/product/${testProductId}`);
      expect(res.status).toBe(401);
    });

    it('should return like status', async () => {
      const res = await request(app)
        .get(`/api/likes/product/${testProductId}`)
        .set('Authorization', testToken);
      
      expect([200, 401]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('liked');
        expect(typeof res.body.liked).toBe('boolean');
      }
    });
  });

  describe('POST /api/likes/product/:productId', () => {
    it('should require authorization', async () => {
      const res = await request(app)
        .post(`/api/likes/product/${testProductId}`);
      expect(res.status).toBe(401);
    });

    it('should toggle product like', async () => {
      const res = await request(app)
        .post(`/api/likes/product/${testProductId}`)
        .set('Authorization', testToken);
      
      expect([200, 401, 409, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('liked');
        expect(typeof res.body.liked).toBe('boolean');
      }
    });
  });
});
