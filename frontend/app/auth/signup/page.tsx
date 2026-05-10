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

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const readRequestError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }
    return 'Registration failed. Try a different email.';
  };

  const signupMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setRequestError(null);
      setAuth(data.token, data.user);
      router.push('/dashboard');
    },
    onError: (error) => {
      setRequestError(readRequestError(error));
    },
  });

  return (
    <main className="traveloop-page flex items-center justify-center py-6 sm:py-10">
      <motion.section className="traveloop-shell w-full max-w-xl rounded-[2rem]" initial={{ opacity: 0, y: 14, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
        <div className="traveloop-content p-5 sm:p-6 lg:p-7">
          <div className="space-y-2">
            <p className="traveloop-kicker">Create account</p>
            <h1 className="traveloop-title text-3xl font-semibold sm:text-4xl">Start planning your next trip</h1>
            <p className="traveloop-copy text-sm sm:text-base">
              Build a polished travel workspace for your next multi-city adventure.
            </p>
          </div>
        <form
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
              setValidationError(parsed.error.issues[0]?.message ?? 'Please review your input.');
              return;
            }
            setValidationError(null);
            setRequestError(null);
            signupMutation.mutate({
              name: parsed.data.name,
              email: parsed.data.email,
              password: parsed.data.password,
            });
          }}
        >
          <input
            className="traveloop-input"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            className="traveloop-input"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="traveloop-input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <input
            className="traveloop-input"
            placeholder="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
          />
          <button
            className="traveloop-button-primary disabled:cursor-not-allowed disabled:opacity-70"
            disabled={signupMutation.isPending}
            type="submit"
          >
            {signupMutation.isPending ? 'Creating account...' : 'Register now'}
          </button>
        </form>
          {validationError ? <p className="mt-4 text-sm text-rose-600">{validationError}</p> : null}
          {requestError ? <p className="mt-4 text-sm text-rose-600">{requestError}</p> : null}
          <p className="mt-4 text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-teal-700">
              Sign in
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
