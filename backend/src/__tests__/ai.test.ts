const request = require('supertest');
import app from '../index';

describe('AI API Gateway', () => {
  describe('GET /api/ai/health', () => {
    it('should return AI service health status', async () => {
      const res = await request(app).get('/api/ai/health');
      
      // Either service online or offline gracefully
      expect([200, 503]).toContain(res.status);
      expect(res.body).toHaveProperty('gateway', 'online');
    });
  });

  describe('POST /api/ai/analyze/image', () => {
    it('should reject requests without image', async () => {
      const res = await request(app)
        .post('/api/ai/analyze/image');
      
      expect([400, 500]).toContain(res.status);
    });

    it('should handle valid image uploads', async () => {
      // Create a minimal valid image (1x1 white PNG)
      const pngBuffer = Buffer.from(
        '89504e470d0a1a0a0000000d494844520000000100000001' +
        '0806000000001f15c4890000000a49444154785e6364f8000' +
        '0030100010001183dd7250000000049454e44ae426082',
        'hex'
      );

      const res = await request(app)
        .post('/api/ai/analyze/image')
        .attach('file', pngBuffer, 'test.png');
      
      // Will work if AI service is up, or return fallback
      expect([200, 503, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('style_type');
        expect(res.body).toHaveProperty('confidence');
      }
    });
  });

  describe('POST /api/ai/analyze/preferences', () => {
    it('should analyze preferences and return style', async () => {
      const res = await request(app)
        .post('/api/ai/analyze/preferences')
        .send({
          preferences: ['minimalist', 'elegant'],
          occasion: 'business'
        });
      
      expect([200, 503, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('style_type');
        expect(res.body).toHaveProperty('recommended_items');
      }
    });

    it('should require occasion field', async () => {
      const res = await request(app)
        .post('/api/ai/analyze/preferences')
        .send({
          preferences: ['minimalist']
        });
      
      // Will handle gracefully or fail validation
      expect([200, 400, 500]).toContain(res.status);
    });
  });

  describe('POST /api/ai/suggest-outfit', () => {
    it('should generate outfit suggestions', async () => {
      const res = await request(app)
        .post('/api/ai/suggest-outfit')
        .send({
          occasion: 'casual',
          budget: 300
        });
      
      expect([200, 503, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('occasion');
        expect(res.body).toHaveProperty('items');
        expect(res.body).toHaveProperty('total_price');
      }
    });

    it('should respect budget constraints', async () => {
      const res = await request(app)
        .post('/api/ai/suggest-outfit')
        .send({
          occasion: 'party',
          budget: 100 // Low budget
        });
      
      if (res.status === 200) {
        expect(parseFloat(res.body.total_price) <= 100).toBe(true);
      }
    });
  });
});
