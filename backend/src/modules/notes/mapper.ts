import type { Note } from '@prisma/client';
import { parseTags } from './tags.js';

export const toNoteDto = (note: Note) => ({
  ...note,
  tags: parseTags(note.tags),
});
