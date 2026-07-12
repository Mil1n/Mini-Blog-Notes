import { describe, expect, it } from 'vitest';
import { filterNotes } from '../frontend/src/shared/utils/filterNotes';
import type { Note } from '../frontend/src/app/store/notesStore';

const notes: Note[] = [
  { id: '1', title: 'Hello', content: 'World', tags: ['react'], category: 'dev', pinned: false, draft: false, favorite: false },
  { id: '2', title: 'Trip plan', content: 'Museum list', tags: ['travel'], category: 'life', pinned: false, draft: true, favorite: true },
];

describe('filterNotes', () => {
  it('returns all notes for an empty query', () => {
    expect(filterNotes(notes, '')).toHaveLength(2);
  });

  it('finds by tag', () => {
    expect(filterNotes(notes, 'react')).toHaveLength(1);
  });

  it('finds by title, content and category case-insensitively', () => {
    expect(filterNotes(notes, 'trip')).toHaveLength(1);
    expect(filterNotes(notes, 'MUSEUM')).toHaveLength(1);
    expect(filterNotes(notes, 'life')).toHaveLength(1);
  });
});
