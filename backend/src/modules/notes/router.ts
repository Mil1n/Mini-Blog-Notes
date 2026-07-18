import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../auth/middleware.js';
import { createNote, deleteNote, listNotes, updateNote } from './service.js';
import { notePatchSchema, noteSchema } from './schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const { q, category, favorite, draft, pinned, limit, cursor } = req.query;
    const result = await listNotes({
      authorId: authReq.user.id,
      query: typeof q === 'string' ? q : '',
      category: typeof category === 'string' ? category : undefined,
      favorite: favorite === 'true',
      draft: draft === 'true',
      pinned: pinned === 'true',
      limit: typeof limit === 'string' ? Number(limit) : undefined,
      cursor: typeof cursor === 'string' ? cursor : undefined,
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const input = noteSchema.parse(req.body);
    return res.status(201).json(await createNote(authReq.user.id, input));
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const input = notePatchSchema.parse(req.body);
    const note = await updateNote(authReq.user.id, req.params.id, input);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json(note);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    const deleted = await deleteNote(authReq.user.id, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export const notesRouter = router;
