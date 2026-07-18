import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../app/store/authStore';
import { useNotesStore, type Note } from '../../app/store/notesStore';
import { api, authToken } from '../../shared/api/client';
import { filterNotes } from '../../shared/utils/filterNotes';

type DraftForm = { title: string; content: string; tags: string; category: string };
const emptyDraft: DraftForm = { title: '', content: '', tags: '', category: 'general' };
const draftKey = 'draft-note';

const readDraft = () => {
  const saved = localStorage.getItem(draftKey);
  if (!saved) return emptyDraft;
  try {
    return { ...emptyDraft, ...JSON.parse(saved) } as DraftForm;
  } catch {
    localStorage.removeItem(draftKey);
    return emptyDraft;
  }
};

export const NotesPage = () => {
  const { user } = useAuthStore();
  const { notes, query, status, error, setQuery, setNotes, setStatus, upsertNote, removeNote } = useNotesStore();
  const [draft, setDraft] = useState<DraftForm>(readDraft);
  const [showOnly, setShowOnly] = useState<'all' | 'pinned' | 'favorite' | 'draft'>('all');
  const [formError, setFormError] = useState('');
  const [busyNoteId, setBusyNoteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    if (!authToken.get()) {
      setNotes([]);
      return;
    }
    setStatus('loading');
    api.listNotes().then((data) => {
      setNotes(data.items);
      setStatus('idle');
    }).catch((loadError) => setStatus('error', loadError instanceof Error ? loadError.message : 'Failed to load notes'));
  }, [setNotes, setStatus, user]);

  const filtered = useMemo(() => {
    const byQuery = filterNotes(notes, query);
    return byQuery.filter((note) => {
      if (showOnly === 'pinned') return note.pinned;
      if (showOnly === 'favorite') return note.favorite;
      if (showOnly === 'draft') return note.draft;
      return true;
    });
  }, [notes, query, showOnly]);

  const submit = async (asDraft = false) => {
    if (!authToken.get()) {
      setFormError('Please log in before publishing or saving notes.');
      return;
    }
    const title = draft.title.trim();
    const content = draft.content.trim();
    if (!title || !content) {
      setFormError('Title and content are required.');
      return;
    }
    setFormError('');
    const payload = {
      title,
      content,
      tags: [...new Set(draft.tags.split(',').map((tag: string) => tag.trim().toLowerCase()).filter(Boolean))],
      category: draft.category.trim() || 'general',
      pinned: false,
      favorite: false,
      draft: asDraft,
    };
    const temporaryNote: Note = { id: crypto.randomUUID(), ...payload };
    upsertNote(temporaryNote);
    try {
      upsertNote(await api.createNote(payload));
      removeNote(temporaryNote.id);
      setDraft(emptyDraft);
      localStorage.removeItem(draftKey);
    } catch (saveError) {
      removeNote(temporaryNote.id);
      setFormError(saveError instanceof Error ? saveError.message : 'Failed to save note');
    }
  };

  const patchNote = async (id: string, patch: Parameters<typeof api.updateNote>[1]) => {
    const current = notes.find((note) => note.id === id);
    if (!current) return;
    setBusyNoteId(id);
    upsertNote({ ...current, ...patch });
    try {
      upsertNote(await api.updateNote(id, patch));
    } catch (patchError) {
      upsertNote(current);
      setFormError(patchError instanceof Error ? patchError.message : 'Failed to update note');
    } finally {
      setBusyNoteId(null);
    }
  };

  const deleteNote = async (id: string) => {
    const current = notes.find((note) => note.id === id);
    if (!current || !confirm('Delete this note?')) return;
    setBusyNoteId(id);
    removeNote(id);
    try {
      await api.deleteNote(id);
    } catch (deleteError) {
      upsertNote(current);
      setFormError(deleteError instanceof Error ? deleteError.message : 'Failed to delete note');
    } finally {
      setBusyNoteId(null);
    }
  };

  const isPublishDisabled = !draft.title.trim() || !draft.content.trim();

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mini Blog / Notes</h1>
          <p className="text-sm text-slate-500">Markdown notes with drafts, tags, categories and API sync.</p>
        </div>
        {!user && <Link className="rounded border px-3 py-2" to="/auth">Log in to sync notes</Link>}
      </div>
      <input className="w-full rounded border p-2" placeholder="Search by title, tag, category or content" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {(['all', 'pinned', 'favorite', 'draft'] as const).map((tab) => <button key={tab} className={`rounded-full border px-3 py-1 ${showOnly === tab ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : ''}`} type="button" onClick={() => setShowOnly(tab)}>{tab}</button>)}
      </div>
      <div className="grid gap-3 rounded-xl border bg-white p-4 dark:bg-slate-900">
        <label className="grid gap-1 text-sm font-medium">Title <span className="text-xs text-slate-500">{draft.title.length}/120</span><input className="rounded border p-2 font-normal" maxLength={120} placeholder="Title" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} /></label>
        <label className="grid gap-1 text-sm font-medium">Tags<input className="rounded border p-2 font-normal" placeholder="Tags, comma-separated" value={draft.tags} onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))} /></label>
        <label className="grid gap-1 text-sm font-medium">Category<input className="rounded border p-2 font-normal" placeholder="Category" value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} /></label>
        <label className="grid gap-1 text-sm font-medium">Markdown content<textarea className="min-h-28 rounded border p-2 font-normal" placeholder="Markdown content" value={draft.content} onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))} /></label>
        {draft.content && <div className="rounded border bg-slate-50 p-3 dark:bg-slate-950"><ReactMarkdown>{draft.content}</ReactMarkdown></div>}
        {formError && <p className="rounded bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{formError}</p>}
        <div className="flex flex-wrap gap-2"><button className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50" disabled={isPublishDisabled} type="button" onClick={() => submit(false)}>Publish</button><button className="rounded border px-4 py-2 disabled:opacity-50" disabled={isPublishDisabled} type="button" onClick={() => submit(true)}>Save draft</button><button className="rounded border px-4 py-2" type="button" onClick={() => setDraft(emptyDraft)}>Clear draft</button></div>
      </div>
      {status === 'loading' && <p>Loading notes…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-3">
        {filtered.map((note) => (
          <motion.li key={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-white p-4 dark:bg-slate-900">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div><h2 className="font-semibold">{note.pinned ? '📌 ' : ''}{note.title}</h2><p className="text-xs text-slate-500">{note.category} · {note.tags.join(', ') || 'no tags'}</p></div>
              <div className="flex flex-wrap gap-2 text-sm">
                <button disabled={busyNoteId === note.id} onClick={() => patchNote(note.id, { pinned: !note.pinned })}>Pin</button>
                <button disabled={busyNoteId === note.id} onClick={() => patchNote(note.id, { favorite: !note.favorite })}>{note.favorite ? '★' : '☆'}</button>
                <button disabled={busyNoteId === note.id} onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </div>
            {note.draft && <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">Draft</span>}
            <div className="prose prose-slate max-w-none dark:prose-invert"><ReactMarkdown>{note.content}</ReactMarkdown></div>
          </motion.li>
        ))}
      </ul>
      {!filtered.length && <p className="rounded border p-4 text-center text-slate-500">{user ? 'No notes yet.' : 'Log in to load and sync your notes.'}</p>}
    </section>
  );
};
