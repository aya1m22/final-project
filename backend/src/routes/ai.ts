import { Router } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// AI Service URL - should be configurable via environment
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Proxy image analysis to AI service
router.post('/analyze/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Create form data for the AI service
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${AI_SERVICE_URL}/analyze/image`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 second timeout
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('AI Image Analysis Error:', error.message);

    // Return fallback response if AI service is down
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.json({
        style_type: 'casual',
        confidence: 0.5,
        description: 'AI service temporarily unavailable. Showing general recommendations.',
        recommended_items: ['T-Shirt', 'Jeans', 'Sneakers'],
        color_palette: ['#000000', '#FFFFFF', '#808080']
      });
    }

    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// Proxy style analysis from preferences to AI service
router.post('/analyze/preferences', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze/preferences`, req.body, {
      timeout: 10000, // 10 second timeout
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('AI Preferences Analysis Error:', error.message);

    // Return fallback response
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.json({
        style_type: 'casual',
        confidence: 0.5,
        description: 'AI service temporarily unavailable. Showing general recommendations.',
        recommended_items: ['T-Shirt', 'Jeans', 'Sneakers'],
        color_palette: ['#000000', '#FFFFFF', '#808080']
      });
    }

    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// Proxy outfit suggestions to AI service
router.post('/suggest-outfit', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/suggest-outfit`, req.body, {
      timeout: 15000, // 15 second timeout
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('AI Outfit Suggestion Error:', error.message);

    // Return fallback response
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      const budget = req.body?.budget;
      let items = [
        { item: 'T-Shirt', price: 25, category: 'tops' },
        { item: 'Jeans', price: 80, category: 'bottoms' },
        { item: 'Sneakers', price: 90, category: 'shoes' }
      ];
      let totalPrice = 195;

      if (budget && totalPrice > budget) {
        const scaleFactor = budget / totalPrice;
        items = items.map(item => ({
          ...item,
          price: Math.round(item.price * scaleFactor * 100) / 100
        }));
        totalPrice = budget;
      }

      return res.json({
        occasion: req.body?.occasion || 'casual',
        items,
        total_price: totalPrice,
        style_score: 7.5
      });
    }

    res.status(500).json({ error: 'Outfit suggestion failed' });
  }
});

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 5000,
    });

    res.json({ ...response.data, gateway: 'online' });
  } catch (error) {
    res.json({ status: 'AI service offline', gateway: 'online' });
  }
});

export default router;