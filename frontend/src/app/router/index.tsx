import { createBrowserRouter, Outlet } from 'react-router-dom';
import { NotesPage } from '../../modules/notes/NotesPage';
import { AuthPage } from '../../modules/auth/AuthPage';
import { ProfilePage } from '../../modules/users/ProfilePage';

const RootLayout = () => (
  <main className="mx-auto max-w-5xl p-4 md:p-6">
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
