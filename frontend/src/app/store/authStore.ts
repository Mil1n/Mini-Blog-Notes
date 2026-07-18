import { create } from 'zustand';
import type { AuthUser } from '../../shared/api/client';

const USER_KEY = 'mini-blog-user';

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

const readUser = () => {
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: readUser(),
  setUser: (user) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
    set({ user });
  },
}));
