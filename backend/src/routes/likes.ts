import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Middleware to verify auth
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // In production, verify JWT token
  (req as any).userId = 1; // Mock user ID
  next();
};

// Get user's liked products
router.get('/user/likes', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const likes = await prisma.productLike.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(likes.map(like => like.product));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user liked a product
router.get('/product/:productId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const productId = Array.isArray(req.params.productId) 
      ? req.params.productId[0] 
      : req.params.productId;

    const like = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId)
        }
      }
    });

    res.json({ liked: !!like });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle like on a product
router.post('/product/:productId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const productId = Array.isArray(req.params.productId) 
      ? req.params.productId[0] 
      : req.params.productId;

    const existing = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId)
        }
      }
    });

    if (existing) {
      // Unlike
      await prisma.productLike.delete({
        where: {
          userId_productId: {
            userId,
            productId: parseInt(productId)
          }
        }
      });
      res.json({ liked: false });
    } else {
      // Like
      await prisma.productLike.create({
        data: {
          userId,
          productId: parseInt(productId)
        }
      });
      res.json({ liked: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
