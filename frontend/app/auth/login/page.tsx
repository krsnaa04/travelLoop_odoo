'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { authApi } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/auth-store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  email: 'demo@traveloop.com',
  password: 'demo123',
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [placeholderMessage, setPlaceholderMessage] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const readRequestError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }
    return 'Login failed. Please check your credentials and try again.';
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setRequestError(null);
      setAuth(data.token, data.user);
      router.push('/dashboard');
    },
    onError: (error) => {
      setValidationError(null);
      setRequestError(readRequestError(error));
    },
  });

  const forgotMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => setPlaceholderMessage(data.message),
    onError: () => setPlaceholderMessage('Failed to process forgot password request.'),
  });

  return (
    <main className="traveloop-page flex items-center justify-center py-6 sm:py-10">
      <motion.section className="traveloop-shell w-full max-w-md rounded-[2rem]" initial={{ opacity: 0, y: 14, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
        <div className="traveloop-content p-5 sm:p-6 lg:p-7">
          <div className="space-y-2">
            <p className="traveloop-kicker">Sign in</p>
            <h1 className="traveloop-title text-3xl font-semibold sm:text-4xl">Welcome back</h1>
            <p className="traveloop-copy text-sm sm:text-base">
              Pick up your trips, budgets, and itineraries exactly where you left them.
            </p>
          </div>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
              setValidationError('Please provide a valid email and password (6+ characters).');
              return;
            }
            setValidationError(null);
            setRequestError(null);
            loginMutation.mutate(parsed.data);
          }}
        >
          <input
            className="traveloop-input"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => {
              setForm((current) => ({ ...current, email: event.target.value }));
              if (validationError) setValidationError(null);
            }}
          />
          <input
            className="traveloop-input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => {
              setForm((current) => ({ ...current, password: event.target.value }));
              if (validationError) setValidationError(null);
            }}
          />
          <button
            className="traveloop-button-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loginMutation.isPending}
            type="submit"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Login'}
          </button>
        </form>
          {validationError ? <p className="mt-4 text-sm text-rose-600">{validationError}</p> : null}
          {requestError ? <p className="mt-4 text-sm text-rose-600">{requestError}</p> : null}
          <motion.div className="mt-5 rounded-[1.35rem] border border-teal-100 bg-teal-50/60 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Demo access</p>
            <p className="mt-1 text-xs text-slate-700">Email: {DEMO_CREDENTIALS.email}</p>
            <p className="text-xs text-slate-700">Password: {DEMO_CREDENTIALS.password}</p>
            <button
              type="button"
              className="traveloop-pill mt-3 bg-white text-teal-700"
              onClick={() => {
                setForm(DEMO_CREDENTIALS);
                setValidationError(null);
              }}
            >
              Use demo credentials
            </button>
          </motion.div>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4"
            onClick={() => {
              if (!form.email) {
                setPlaceholderMessage('Enter your email first, then click Forgot Password again.');
                return;
              }
              forgotMutation.mutate(form.email);
            }}
          >
            Forgot Password
          </button>
          {placeholderMessage ? <p className="mt-2 text-xs text-slate-600">{placeholderMessage}</p> : null}
          <p className="mt-4 text-sm text-slate-600">
            New here?{' '}
            <Link href="/auth/signup" className="font-medium text-teal-700">
              Create an account
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
