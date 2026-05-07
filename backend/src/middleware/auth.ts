import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

export default function auth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}