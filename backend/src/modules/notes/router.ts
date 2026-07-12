import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db.js';
import { requireAuth, type AuthenticatedRequest } from '../auth/middleware.js';

const router = Router();
const noteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1),
  tags: z.array(z.string()).default([]),
  category: z.string().trim().min(1).default('general'),
  pinned: z.boolean().default(false),
  favorite: z.boolean().default(false),
  draft: z.boolean().default(false),
});
const patchSchema = noteSchema.partial();

const normalizeTags = (tags: string[]) => [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
const serializeTags = (tags: string[]) => JSON.stringify(normalizeTags(tags));
const parseTags = (tags: string) => {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === 'string') : [];
  } catch {
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
};
const toDto = (note: { id: string; title: string; content: string; tags: string; category: string; pinned: boolean; favorite: boolean; draft: boolean; authorId: string; createdAt: Date; updatedAt: Date }) => ({
  ...note,
  tags: parseTags(note.tags),
});

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const { q, category, favorite, draft, pinned } = req.query;
    const notes = await prisma.note.findMany({
      where: {
        authorId: authReq.user.id,
        ...(typeof category === 'string' && category ? { category } : {}),
        ...(favorite === 'true' ? { favorite: true } : {}),
        ...(draft === 'true' ? { draft: true } : {}),
        ...(pinned === 'true' ? { pinned: true } : {}),
      },
      orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
    });
    const query = typeof q === 'string' ? q.toLowerCase().trim() : '';
    const filtered = query
      ? notes.filter((note) => [note.title, note.content, note.category, parseTags(note.tags).join(' ')].join(' ').toLowerCase().includes(query))
      : notes;
    return res.json(filtered.map(toDto));
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const input = noteSchema.parse(req.body);
    const note = await prisma.note.create({ data: { ...input, tags: serializeTags(input.tags), authorId: authReq.user.id } });
    return res.status(201).json(toDto(note));
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const input = patchSchema.parse(req.body);
    const existing = await prisma.note.findFirst({ where: { id: req.params.id, authorId: authReq.user.id } });
    if (!existing) return res.status(404).json({ message: 'Note not found' });
    const note = await prisma.note.update({
      where: { id: existing.id },
      data: { ...input, tags: input.tags ? serializeTags(input.tags) : undefined },
    });
    return res.json(toDto(note));
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const existing = await prisma.note.findFirst({ where: { id: req.params.id, authorId: authReq.user.id } });
    if (!existing) return res.status(404).json({ message: 'Note not found' });
    await prisma.note.delete({ where: { id: existing.id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export const notesRouter = router;
