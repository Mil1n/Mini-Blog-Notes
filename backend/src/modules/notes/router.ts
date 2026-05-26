import { Router } from 'express';
const router = Router();
router.get('/', (_req, res) => res.json([]));
router.post('/', (_req, res) => res.status(201).json({ id: 'new-note' }));
export const notesRouter = router;
