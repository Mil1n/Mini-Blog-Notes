import { describe, expect, it } from 'vitest';
import { normalizeTags, parseTags, serializeTags } from './tags.js';

describe('note tags helpers', () => {
  it('normalizes casing, whitespace and duplicates', () => {
    expect(normalizeTags([' React ', 'react', '', 'TS'])).toEqual(['react', 'ts']);
  });

  it('serializes and parses JSON tags', () => {
    expect(parseTags(serializeTags(['Blog', ' blog ']))).toEqual(['blog']);
  });

  it('falls back to comma-separated tags', () => {
    expect(parseTags('Dev, Notes, dev')).toEqual(['dev', 'notes']);
  });
});
