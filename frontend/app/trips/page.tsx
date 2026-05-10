'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AppShell } from '../../components/app-shell';
import { AuthGate } from '../../components/auth-gate';
import { MotionArticle, itemMotion, stagger } from '../../components/motion';
import { SkeletonBlock } from '../../components/loading-skeleton';
import { EmptyState } from '../../components/empty-state';
import { tripApi } from '../../lib/api-client';
import { formatCurrency, formatDate } from '../../lib/format';

export default function TripsPage() {
  const queryClient = useQueryClient();
  const tripsQuery = useQuery({
    queryKey: ['trips'],
    queryFn: tripApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: (tripId: string) => tripApi.remove(tripId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const trips = tripsQuery.data ?? [];
  const isEmpty = !tripsQuery.isLoading && !tripsQuery.isError && trips.length === 0;

  return (
    <AuthGate>
      <AppShell title="My Trips" subtitle="Manage every itinerary, builder, and budget from one place.">
        <motion.div className="flex justify-stretch sm:justify-end" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
          <Link href="/trips/new" className="traveloop-button-primary">
            Plan new trip
          </Link>
        </motion.div>
        {tripsQuery.isLoading ? (
          <motion.div className="mt-6 grid gap-4" variants={stagger} initial="initial" animate="animate">
            {Array.from({ length: 3 }).map((_, index) => (
              <MotionArticle key={index} className="traveloop-card rounded-[1.5rem] p-5" variants={itemMotion}>
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="mt-3 h-7 w-2/3" />
                <SkeletonBlock className="mt-2 h-4 w-3/4" />
                <div className="mt-4 flex gap-2">
                  <SkeletonBlock className="h-9 w-24 rounded-full" />
                  <SkeletonBlock className="h-9 w-24 rounded-full" />
                </div>
              </MotionArticle>
            ))}
          </motion.div>
        ) : null}
        {tripsQuery.isError ? <p className="mt-6 text-sm text-rose-600">Could not load trips.</p> : null}
        {isEmpty ? (
          <div className="mt-6">
            <EmptyState
              title="No trips yet"
              description="Start planning your first adventure. This account is private and empty until you create your own itinerary."
              ctaLabel="Create Trip"
              ctaHref="/trips/new"
            />
          </div>
        ) : null}
        <div className="mt-6 grid gap-4">
          {trips.map((trip) => (
            <MotionArticle key={trip.id} className="traveloop-card rounded-[1.5rem] p-5 sm:p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }} whileHover={{ y: -4, scale: 1.01 }}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-[1.75rem]">{trip.title}</h2>
                  <p className="traveloop-copy text-sm sm:max-w-2xl">{trip.description || 'No description yet.'}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {trip.destinationCount} stops | Budget {formatCurrency(trip.budget, trip.currencyCode)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end">
                  <Link className="traveloop-button-secondary px-3 py-2 text-xs" href={`/trips/${trip.id}`}>
                    View
                  </Link>
                  <Link className="traveloop-button-secondary px-3 py-2 text-xs" href={`/trips/${trip.id}/builder`}>
                    Builder
                  </Link>
                  <Link className="traveloop-button-secondary px-3 py-2 text-xs" href={`/trips/${trip.id}/budget`}>
                    Budget
                  </Link>
                  <button
                    className="traveloop-button-secondary px-3 py-2 text-xs text-rose-700"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(trip.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </MotionArticle>
          ))}
        </div>
      </AppShell>
    </AuthGate>
  );
}
