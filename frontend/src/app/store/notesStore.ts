import { create } from 'zustand';

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  pinned: boolean;
  draft: boolean;
  favorite: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type NotesState = {
  notes: Note[];
  query: string;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  setQuery: (query: string) => void;
  setNotes: (notes: Note[]) => void;
  setStatus: (status: NotesState['status'], error?: string | null) => void;
  upsertNote: (note: Note) => void;
  removeNote: (id: string) => void;
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  query: '',
  status: 'idle',
  error: null,
  setQuery: (query) => set({ query }),
  setNotes: (notes) => set({ notes }),
  setStatus: (status, error = null) => set({ status, error }),
  upsertNote: (note) =>
    set((state) => {
      const exists = state.notes.find((n) => n.id === note.id);
      return {
        notes: exists
          ? state.notes.map((n) => (n.id === note.id ? note : n))
          : [note, ...state.notes],
      };
    }),
  removeNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
}));
