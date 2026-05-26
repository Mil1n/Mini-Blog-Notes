import { describe, expect, it } from 'vitest';
import { filterNotes } from '../frontend/src/shared/utils/filterNotes';

describe('filterNotes', () => {
  it('finds by tag', () => {
    const notes = [{ id: '1', title: 'Hello', content: 'World', tags: ['react'], category: 'dev', pinned: false, draft: false, favorite: false }];
    expect(filterNotes(notes, 'react')).toHaveLength(1);
  });
});
