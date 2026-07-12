import { FormEvent, useState } from 'react';
import { authToken, api } from '../../shared/api/client';

export const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@example.com');
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('password');
  const [message, setMessage] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = mode === 'login'
        ? await api.login({ email, password })
        : await api.register({ email, username, password });
      authToken.set(response.token);
      setMessage(`Signed in as @${response.user.username}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Auth failed');
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900">
      <h1 className="text-2xl font-bold">Auth</h1>
      <div className="flex gap-2">
        <button className="rounded border px-3 py-1" onClick={() => setMode('login')}>Login</button>
        <button className="rounded border px-3 py-1" onClick={() => setMode('register')}>Register</button>
      </div>
      <form className="grid gap-3" onSubmit={submit}>
        <input className="rounded border p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        {mode === 'register' && <input className="rounded border p-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />}
        <input className="rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="rounded bg-slate-900 px-4 py-2 text-white dark:bg-white dark:text-slate-900">{mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>
      {message && <p className="rounded bg-slate-100 p-2 text-sm dark:bg-slate-800">{message}</p>}
    </section>
  );
};
