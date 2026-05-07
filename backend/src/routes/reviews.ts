import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Middleware to verify auth (basic check)
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // In production, verify JWT token
  (req as any).userId = 1; // Mock user ID
  next();
};

// Get reviews for a product
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const productId = Array.isArray(req.params.productId) 
      ? req.params.productId[0] 
      : req.params.productId;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await prisma.review.findMany({
      where: {
        productId: parseInt(productId),
        status: 'approved'
      },
      include: {
        user: {
          select: { id: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.review.count({
      where: {
        productId: parseInt(productId),
        status: 'approved'
      }
    });

    res.json({
      reviews,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get review stats for a product
router.get('/stats/:productId', async (req: Request, res: Response) => {
  try {
    const productId = Array.isArray(req.params.productId) 
      ? req.params.productId[0] 
      : req.params.productId;

    const reviews = await prisma.review.findMany({
      where: {
        productId: parseInt(productId),
        status: 'approved'
      },
      select: { rating: true }
    });

    if (reviews.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach(review => {
      totalRating += review.rating;
      ratingBreakdown[review.rating as keyof typeof ratingBreakdown]++;
    });

    res.json({
      averageRating: (totalRating / reviews.length).toFixed(1),
      totalReviews: reviews.length,
      ratingBreakdown
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a review
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { productId, rating, title, content, images } = req.body;
    const userId = (req as any).userId;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid product ID or rating' });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId: parseInt(Array.isArray(productId) ? productId[0] : productId),
        rating: parseInt(rating),
        title,
        content,
        images: images ? JSON.stringify(images) : null,
        status: 'approved' // In production, require moderation
      },
      include: {
        user: { select: { id: true, email: true } }
      }
    });

    // Update product rating
    const stats = await prisma.review.findMany({
      where: { productId: parseInt(Array.isArray(productId) ? productId[0] : productId), status: 'approved' },
      select: { rating: true }
    });

    const avgRating = stats.length > 0
      ? stats.reduce((sum, r) => sum + r.rating, 0) / stats.length
      : 4.5;

    await prisma.product.update({
      where: { id: parseInt(Array.isArray(productId) ? productId[0] : productId) },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: stats.length
      }
    });

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update review helpfulness
router.patch('/:reviewId/helpful', async (req: Request, res: Response) => {
  try {
    const reviewId = Array.isArray(req.params.reviewId) 
      ? req.params.reviewId[0] 
      : req.params.reviewId;
    const { helpful } = req.body; // true for helpful, false for not helpful

    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updated = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: {
        helpful: helpful ? review.helpful + 1 : review.helpful,
        notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
