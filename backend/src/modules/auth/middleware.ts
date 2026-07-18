import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../../config.js';

export type AuthUser = { id: string; email: string; username: string };
export type AuthenticatedRequest = Request & { user: AuthUser };

type TokenPayload = { sub: string; email: string; username: string };

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
  if (!token) return res.status(401).json({ message: 'Missing bearer token' });

  try {
    const payload = jwt.verify(token, getJwtSecret()) as TokenPayload;
    (req as AuthenticatedRequest).user = { id: payload.sub, email: payload.email, username: payload.username };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
