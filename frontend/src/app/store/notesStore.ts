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
};

type NotesState = {
  notes: Note[];
  query: string;
  setQuery: (query: string) => void;
  upsertNote: (note: Note) => void;
  removeNote: (id: string) => void;
  togglePin: (id: string) => void;
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  query: '',
  setQuery: (query) => set({ query }),
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
  togglePin: (id) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    })),
}));
