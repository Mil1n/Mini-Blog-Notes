import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../db.js';

const router = Router();
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
const registerSchema = credentialsSchema.extend({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/),
});
const jwtSecret = () => process.env.JWT_SECRET || 'dev-secret-change-me';

const signToken = (user: { id: string; email: string; username: string }) =>
  jwt.sign({ sub: user.id, email: user.email, username: user.username }, jwtSecret(), { expiresIn: '7d' });

const publicUser = (user: { id: string; email: string; username: string; createdAt: Date }) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  createdAt: user.createdAt,
});

router.post('/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const existing = await prisma.user.findFirst({ where: { OR: [{ email: input.email }, { username: input.username }] } });
    if (existing) return res.status(409).json({ message: 'Email or username already exists' });

    const password = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({ data: { email: input.email, username: input.username, password } });
    return res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const input = credentialsSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export const authRouter = router;
