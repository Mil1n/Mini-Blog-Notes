import { Router } from 'express';
const router = Router();
router.post('/register', (_req, res) => res.json({ message: 'register endpoint' }));
router.post('/login', (_req, res) => res.json({ token: 'jwt-token' }));
export const authRouter = router;
