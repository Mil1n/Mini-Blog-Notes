import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useNotesStore, type Note } from '../../app/store/notesStore';
import { api, authToken } from '../../shared/api/client';
import { filterNotes } from '../../shared/utils/filterNotes';

type DraftForm = { title: string; content: string; tags: string; category: string };
const emptyDraft: DraftForm = { title: '', content: '', tags: '', category: 'general' };
const draftKey = 'draft-note';

export const NotesPage = () => {
  const { notes, query, status, error, setQuery, setNotes, setStatus, upsertNote, removeNote } = useNotesStore();
  const [draft, setDraft] = useState(() => {
    const saved = localStorage.getItem(draftKey);
    return saved ? ({ ...emptyDraft, ...JSON.parse(saved) } as DraftForm) : emptyDraft;
  });
  const [showOnly, setShowOnly] = useState<'all' | 'pinned' | 'favorite' | 'draft'>('all');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    if (!authToken.get()) return;
    setStatus('loading');
    api.listNotes().then((data) => {
      setNotes(data);
      setStatus('idle');
    }).catch((loadError) => setStatus('error', loadError instanceof Error ? loadError.message : 'Failed to load notes'));
  }, [setNotes, setStatus]);

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
      if (authToken.get()) upsertNote(await api.createNote(payload));
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
    upsertNote({ ...current, ...patch });
    if (authToken.get()) upsertNote(await api.updateNote(id, patch));
  };

  const deleteNote = async (id: string) => {
    removeNote(id);
    if (authToken.get()) await api.deleteNote(id);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mini Blog / Notes</h1>
          <p className="text-sm text-slate-500">Markdown notes with drafts, tags, categories and API sync.</p>
        </div>
        <a className="rounded border px-3 py-2" href="/auth">Auth</a>
      </div>
      <input className="w-full rounded border p-2" placeholder="Search by title, tag, category or content" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {(['all', 'pinned', 'favorite', 'draft'] as const).map((tab) => <button key={tab} className={`rounded-full border px-3 py-1 ${showOnly === tab ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : ''}`} onClick={() => setShowOnly(tab)}>{tab}</button>)}
      </div>
      <div className="grid gap-3 rounded-xl border bg-white p-4 dark:bg-slate-900">
        <input className="rounded border p-2" placeholder="Title" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Tags, comma-separated" value={draft.tags} onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Category" value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} />
        <textarea className="min-h-28 rounded border p-2" placeholder="Markdown content" value={draft.content} onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))} />
        {draft.content && <div className="rounded border bg-slate-50 p-3 dark:bg-slate-950"><ReactMarkdown>{draft.content}</ReactMarkdown></div>}
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <div className="flex gap-2"><button className="rounded bg-slate-900 px-4 py-2 text-white" onClick={() => submit(false)}>Publish</button><button className="rounded border px-4 py-2" onClick={() => submit(true)}>Save draft</button></div>
      </div>
      {status === 'loading' && <p>Loading notes…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-3">
        {filtered.map((note) => (
          <motion.li key={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-white p-4 dark:bg-slate-900">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div><h2 className="font-semibold">{note.pinned ? '📌 ' : ''}{note.title}</h2><p className="text-xs text-slate-500">{note.category} · {note.tags.join(', ') || 'no tags'}</p></div>
              <div className="flex flex-wrap gap-2 text-sm">
                <button onClick={() => patchNote(note.id, { pinned: !note.pinned })}>Pin</button>
                <button onClick={() => patchNote(note.id, { favorite: !note.favorite })}>{note.favorite ? '★' : '☆'}</button>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </div>
            {note.draft && <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">Draft</span>}
            <div className="prose prose-slate max-w-none dark:prose-invert"><ReactMarkdown>{note.content}</ReactMarkdown></div>
          </motion.li>
        ))}
      </ul>
      {!filtered.length && <p className="rounded border p-4 text-center text-slate-500">No notes yet.</p>}
    </section>
  );
};
