import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNotesStore } from '../../app/store/notesStore';

export const ProfilePage = () => {
  const { username } = useParams();
  const notes = useNotesStore((state) => state.notes);
  const stats = useMemo(() => ({
    published: notes.filter((note) => !note.draft).length,
    drafts: notes.filter((note) => note.draft).length,
    favorites: notes.filter((note) => note.favorite).length,
    tags: new Set(notes.flatMap((note) => note.tags)).size,
  }), [notes]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">@{username}</h1>
      <p className="text-slate-500">Public profile with authored notes, drafts and favorites from the current workspace.</p>
      <dl className="grid gap-3 sm:grid-cols-4">
        <div className="rounded border p-4"><dt className="text-sm text-slate-500">Published</dt><dd className="text-2xl font-bold">{stats.published}</dd></div>
        <div className="rounded border p-4"><dt className="text-sm text-slate-500">Drafts</dt><dd className="text-2xl font-bold">{stats.drafts}</dd></div>
        <div className="rounded border p-4"><dt className="text-sm text-slate-500">Favorites</dt><dd className="text-2xl font-bold">{stats.favorites}</dd></div>
        <div className="rounded border p-4"><dt className="text-sm text-slate-500">Tags</dt><dd className="text-2xl font-bold">{stats.tags}</dd></div>
      </dl>
    </section>
  );
};
