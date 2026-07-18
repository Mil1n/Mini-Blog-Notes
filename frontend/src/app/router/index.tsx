import { createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authToken } from '../../shared/api/client';
import { NotesPage } from '../../modules/notes/NotesPage';
import { AuthPage } from '../../modules/auth/AuthPage';
import { ProfilePage } from '../../modules/users/ProfilePage';

const RootLayout = () => {
  const { user, setUser } = useAuthStore();
  const logout = () => {
    authToken.clear();
    setUser(null);
  };

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-3 shadow-sm dark:bg-slate-900">
        <Link className="font-bold" to="/">Mini Blog</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/">Notes</Link>
          {user ? <Link to={`/users/${user.username}`}>@{user.username}</Link> : <Link to="/auth">Auth</Link>}
          {user && <button className="rounded border px-2 py-1" onClick={logout}>Logout</button>}
        </nav>
      </header>
      <Outlet />
    </main>
  );
};

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <NotesPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/users/:username', element: <ProfilePage /> },
    ],
  },
]);
