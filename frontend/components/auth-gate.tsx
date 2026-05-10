'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../lib/auth-store';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace('/auth/login');
    }
  }, [hydrated, router, token]);

  if (!hydrated) {
    return <div className="p-6 text-sm text-slate-600">Preparing your workspace...</div>;
  }

  if (!token) {
    return <div className="p-6 text-sm text-slate-600">Redirecting to login...</div>;
  }

  return <>{children}</>;
}
