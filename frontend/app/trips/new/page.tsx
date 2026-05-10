'use client';

import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { AppShell } from '../../../components/app-shell';
import { AuthGate } from '../../../components/auth-gate';
import { MotionSection } from '../../../components/motion';
import { tripApi } from '../../../lib/api-client';

const schema = z
  .object({
    title: z.string().min(2),
    description: z.string().max(500).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budget: z.coerce.number().min(0),
    currencyCode: z.string().length(3).transform((value) => value.toUpperCase()),
    coverImageUrl: z.string().url().or(z.literal('')).optional(),
  })
  .refine((value) => {
    if (!value.startDate || !value.endDate) return true;
    return new Date(value.endDate).valueOf() >= new Date(value.startDate).valueOf();
  }, 'End date must be on or after start date.');

export default function CreateTripPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    currencyCode: 'USD',
    coverImageUrl: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: tripApi.create,
    onSuccess: (trip) => {
      router.push(`/trips/${trip.id}/builder`);
    },
  });

  return (
    <AuthGate>
      <AppShell title="Create Trip" subtitle="Start with trip basics, then move to stop-by-stop planning.">
        <MotionSection
          className="rounded-[1.75rem] border border-white/8 bg-slate-900/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
              setValidationError(parsed.error.issues[0]?.message ?? 'Please review your form.');
              return;
            }
            setValidationError(null);
            createMutation.mutate({
              title: parsed.data.title,
              description: parsed.data.description || null,
              startDate: parsed.data.startDate || null,
              endDate: parsed.data.endDate || null,
              budget: parsed.data.budget,
              currencyCode: parsed.data.currencyCode,
              coverImageUrl: parsed.data.coverImageUrl || null,
            });
          }}
        >
          <input
            className="traveloop-input"
            placeholder="Trip name"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          />
          <input
            className="traveloop-input"
            placeholder="Currency (e.g. USD)"
            maxLength={3}
            value={form.currencyCode}
            onChange={(event) => setForm((current) => ({ ...current, currencyCode: event.target.value }))}
          />
          <input
            className="traveloop-input"
            placeholder="Start date"
            type="date"
            value={form.startDate}
            onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
          />
          <input
            className="traveloop-input"
            placeholder="End date"
            type="date"
            value={form.endDate}
            onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
          />
          <input
            className="traveloop-input"
            placeholder="Budget"
            type="number"
            min={0}
            step="0.01"
            value={form.budget}
            onChange={(event) => setForm((current) => ({ ...current, budget: Number(event.target.value) }))}
          />
          <input
            className="traveloop-input"
            placeholder="Cover image URL (optional)"
            value={form.coverImageUrl}
            onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))}
          />
          <textarea
            className="traveloop-input min-h-36 md:col-span-2"
            placeholder="Trip description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
          <button
            className="traveloop-button-primary md:col-span-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={createMutation.isPending}
            type="submit"
          >
            {createMutation.isPending ? 'Saving...' : 'Save trip'}
          </button>
        </form>
        {validationError ? <p className="mt-4 text-sm text-rose-600">{validationError}</p> : null}
        {createMutation.isError ? <p className="mt-4 text-sm text-rose-600">Could not create trip right now.</p> : null}
        </MotionSection>
      </AppShell>
    </AuthGate>
  );
}
