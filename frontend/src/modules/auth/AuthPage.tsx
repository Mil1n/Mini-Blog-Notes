import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store/authStore';
import { authToken, api } from '../../shared/api/client';

export const AuthPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@example.com');
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('password');
  const [message, setMessage] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      const response = mode === 'login'
        ? await api.login({ email, password })
        : await api.register({ email, username, password });
      authToken.set(response.token);
      setUser(response.user);
      navigate('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Auth failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900">
      <h1 className="text-2xl font-bold">Auth</h1>
      <div className="flex gap-2">
        <button className="rounded border px-3 py-1" type="button" onClick={() => setMode('login')}>Login</button>
        <button className="rounded border px-3 py-1" type="button" onClick={() => setMode('register')}>Register</button>
      </div>
      <form className="grid gap-3" onSubmit={submit}>
        <label className="grid gap-1 text-sm font-medium">Email<input className="rounded border p-2 font-normal" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /></label>
        {mode === 'register' && <label className="grid gap-1 text-sm font-medium">Username<input className="rounded border p-2 font-normal" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" /></label>}
        <label className="grid gap-1 text-sm font-medium">Password<input className="rounded border p-2 font-normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /></label>
        <button className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-slate-900" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>
      {message && <p className="rounded bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{message}</p>}
    </section>
  );
};
