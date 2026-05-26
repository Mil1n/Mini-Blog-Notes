import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useNotesStore } from '../../app/store/notesStore';

export const NotesPage = () => {
  const { notes, query, setQuery, upsertNote, removeNote, togglePin } = useNotesStore();
  const [draft, setDraft] = useState({ title: '', content: '', tags: '', category: 'general' });

  const filtered = useMemo(
    () =>
      notes.filter((n) =>
        [n.title, n.content, n.tags.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase()),
      ),
    [notes, query],
  );

  const saveDraft = () => localStorage.setItem('draft-note', JSON.stringify(draft));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Mini Blog / Notes</h1>
      <input className="w-full rounded border p-2" placeholder="Search by title, tag or content" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="grid gap-3 rounded-xl border bg-white p-4 dark:bg-slate-900">
        <input className="rounded border p-2" placeholder="Title" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
        <textarea className="min-h-24 rounded border p-2" placeholder="Markdown content" value={draft.content} onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))} />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" onClick={() => { saveDraft(); upsertNote({ id: crypto.randomUUID(), title: draft.title, content: draft.content, tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean), category: draft.category, pinned: false, draft: false, favorite: false }); setDraft({ title: '', content: '', tags: '', category: 'general' }); }}>Publish</button>
      </div>
      <ul className="space-y-3">
        {filtered.map((note) => (
          <motion.li key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">{note.pinned ? '📌 ' : ''}{note.title}</h2>
              <div className="space-x-2">
                <button onClick={() => togglePin(note.id)}>Pin</button>
                <button onClick={() => removeNote(note.id)}>Delete</button>
              </div>
            </div>
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};
