import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1),
  tags: z.array(z.string()).default([]),
  category: z.string().trim().min(1).default('general'),
  pinned: z.boolean().default(false),
  favorite: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export const notePatchSchema = noteSchema.partial();
export type NoteInput = z.infer<typeof noteSchema>;
export type NotePatch = z.infer<typeof notePatchSchema>;
