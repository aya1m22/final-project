import { Request, Response, NextFunction } from 'express';

export default function roles(allowed: string[]) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowed.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
