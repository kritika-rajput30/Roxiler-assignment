import { Request, Response, NextFunction } from 'express';

// Allowed roles: 'admin', 'user', 'owner'
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    next();
  };
};
