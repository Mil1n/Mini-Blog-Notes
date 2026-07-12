import { createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { NotesPage } from '../../modules/notes/NotesPage';
import { AuthPage } from '../../modules/auth/AuthPage';
import { ProfilePage } from '../../modules/users/ProfilePage';

const RootLayout = () => (
  <main className="mx-auto max-w-5xl p-4 md:p-6">
    <header className="mb-6 flex items-center justify-between rounded-2xl border bg-white p-3 shadow-sm dark:bg-slate-900">
      <Link className="font-bold" to="/">Mini Blog</Link>
      <nav className="flex gap-3 text-sm">
        <Link to="/">Notes</Link>
        <Link to="/auth">Auth</Link>
        <Link to="/users/demo">Profile</Link>
      </nav>
    </header>
    <Outlet />
  </main>
);

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

