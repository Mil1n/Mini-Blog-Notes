import { prisma } from '../../db.js';
import { toNoteDto } from './mapper.js';
import { parseTags, serializeTags } from './tags.js';
import type { NoteInput, NotePatch } from './schema.js';

type ListParams = {
  authorId: string;
  query?: string;
  category?: string;
  favorite?: boolean;
  draft?: boolean;
  pinned?: boolean;
  limit?: number;
  cursor?: string;
};

export const listNotes = async ({ authorId, query = '', category, favorite, draft, pinned, limit = 50, cursor }: ListParams) => {
  const take = Math.min(Math.max(limit, 1), 100);
  const notes = await prisma.note.findMany({
    where: { authorId, ...(category ? { category } : {}), ...(favorite ? { favorite: true } : {}), ...(draft ? { draft: true } : {}), ...(pinned ? { pinned: true } : {}) },
    orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  const q = query.toLowerCase().trim();
  const filtered = q ? notes.filter((note) => [note.title, note.content, note.category, parseTags(note.tags).join(' ')].join(' ').toLowerCase().includes(q)) : notes;
  const page = filtered.slice(0, take);
  return { items: page.map(toNoteDto), nextCursor: filtered.length > take ? filtered[take].id : null };
};

export const createNote = async (authorId: string, input: NoteInput) =>
  toNoteDto(await prisma.note.create({ data: { ...input, tags: serializeTags(input.tags), authorId } }));

export const updateNote = async (authorId: string, id: string, input: NotePatch) => {
  const existing = await prisma.note.findFirst({ where: { id, authorId } });
  if (!existing) return null;
  return toNoteDto(await prisma.note.update({ where: { id: existing.id }, data: { ...input, tags: input.tags ? serializeTags(input.tags) : undefined } }));
};

export const deleteNote = async (authorId: string, id: string) => {
  const existing = await prisma.note.findFirst({ where: { id, authorId } });
  if (!existing) return false;
  await prisma.note.delete({ where: { id: existing.id } });
  return true;
};
