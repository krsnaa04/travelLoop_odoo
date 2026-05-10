'use client';

import { create } from 'zustand';
import type { AuthUser } from './contracts';

const AUTH_KEY = 'traveloop-auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  initialize: () => void;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

const loadAuthFromStorage = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return { token: null, user: null };
  try {
    const parsed = JSON.parse(raw) as { token: string | null; user: AuthUser | null };
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const saveAuthToStorage = (token: string | null, user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  if (!token) {
    window.localStorage.removeItem(AUTH_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  hydrated: false,
  initialize: () => {
    if (get().hydrated) return;
    const { token, user } = loadAuthFromStorage();
    set({ token, user, hydrated: true });
  },
  setAuth: (token, user) => {
    saveAuthToStorage(token, user);
    set({ token, user, hydrated: true });
  },
  clearAuth: () => {
    saveAuthToStorage(null, null);
    set({ token: null, user: null, hydrated: true });
  },
}));
