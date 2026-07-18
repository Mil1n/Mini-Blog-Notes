import { useAuthStore } from '../../app/store/authStore';
import type { Note } from '../../app/store/notesStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'mini-blog-token';

export type AuthUser = { id: string; email: string; username: string; createdAt: string };
export type AuthResponse = { token: string; user: AuthUser };
export type NotesResponse = { items: Note[]; nextCursor: string | null };
export type NoteInput = Omit<Note, 'id'>;

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  useAuthStore.getState().setUser(null);
};

const request = async <T>(path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 401) clearSession();
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const authToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: clearSession,
};

export const api = {
  register: (payload: { email: string; username: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request<{ user: AuthUser }>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  listNotes: () => request<NotesResponse>('/notes'),
  createNote: (payload: NoteInput) => request<Note>('/notes', { method: 'POST', body: JSON.stringify(payload) }),
  updateNote: (id: string, payload: Partial<NoteInput>) => request<Note>(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteNote: (id: string) => request<void>(`/notes/${id}`, { method: 'DELETE' }),
};
