import { Note } from '../../app/store/notesStore';

export const filterNotes = (notes: Note[], query: string) => {
  const q = query.toLowerCase().trim();
  if (!q) return notes;
  return notes.filter((n) => [n.title, n.content, n.tags.join(' ')].join(' ').toLowerCase().includes(q));
};
