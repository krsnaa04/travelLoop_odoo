'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { AuthGate } from '../../../components/auth-gate';
import { AnimatedModal } from '../../../components/animated-modal';
import { MotionArticle, MotionSection, itemMotion, stagger } from '../../../components/motion';
import { SkeletonBlock } from '../../../components/loading-skeleton';
import { tripApi } from '../../../lib/api-client';
import { formatCurrency, formatDate } from '../../../lib/format';

export default function TripDetailPage() {
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const tripQuery = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.get(tripId),
  });

  const stopsQuery = useQuery({
    queryKey: ['trip-stops', tripId],
    queryFn: () => tripApi.listStops(tripId),
  });

  const shareMutation = useMutation({
    mutationFn: () => tripApi.share(tripId),
    onSuccess: (result) => {
      const publicUrl = `${window.location.origin}/public/${result.slug}`;
      setShareUrl(publicUrl);
    },
  });

  const trip = tripQuery.data;
  const stops = stopsQuery.data ?? [];

  return (
    <AuthGate>
      <AppShell title={trip?.title ?? 'Itinerary View'} subtitle="Review your structured trip plan and share it publicly when ready.">
        {tripQuery.isLoading ? (
          <motion.div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]" variants={stagger} initial="initial" animate="animate">
            <MotionSection className="rounded-2xl border border-black/8 bg-white p-5" variants={itemMotion}>
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-3 h-8 w-3/4" />
              <SkeletonBlock className="mt-2 h-5 w-2/3" />
              <div className="mt-4 flex gap-2">
                <SkeletonBlock className="h-9 w-28 rounded-full" />
                <SkeletonBlock className="h-9 w-28 rounded-full" />
                <SkeletonBlock className="h-9 w-28 rounded-full" />
              </div>
            </MotionSection>
            <MotionSection className="rounded-2xl border border-black/8 bg-white p-5" variants={itemMotion}>
              <SkeletonBlock className="h-5 w-36" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-24 rounded-xl" />
                ))}
              </div>
            </MotionSection>
          </motion.div>
        ) : null}
        {tripQuery.isError ? <p className="text-sm text-rose-600">Could not load this trip.</p> : null}
        {trip ? (
          <>
            <MotionSection className="rounded-2xl border border-black/8 bg-white p-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900 sm:text-[1.75rem]">{trip.title}</h2>
                  <p className="text-sm text-slate-600 sm:max-w-2xl">{trip.description || 'No description yet.'}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                  <Link className="rounded-full border border-black/10 px-3 py-1 text-sm" href={`/trips/${trip.id}/builder`}>
                    Open builder
                  </Link>
                  <Link className="rounded-full border border-black/10 px-3 py-1 text-sm" href={`/trips/${trip.id}/budget`}>
                    Budget breakdown
                  </Link>
                  <button
                    className="rounded-full bg-teal-700 px-3 py-1 text-sm text-white disabled:opacity-70"
                    type="button"
                    disabled={shareMutation.isPending}
                    onClick={() => shareMutation.mutate()}
                  >
                    {shareMutation.isPending ? 'Publishing...' : 'Publish share'}
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700 sm:flex-row sm:flex-wrap sm:gap-4">
                <span>Budget: {formatCurrency(trip.budget, trip.currencyCode)}</span>
                <span>Stops: {trip.destinationCount}</span>
                <span>Currency: {trip.currencyCode}</span>
              </div>
              {shareUrl ? (
                <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  Public link:{' '}
                  <Link className="font-medium text-teal-700 underline" href={shareUrl} target="_blank">
                    {shareUrl}
                  </Link>
                </p>
              ) : null}
            </MotionSection>

            <MotionSection className="mt-6 rounded-2xl border border-black/8 bg-white p-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
              <h3 className="text-lg font-semibold text-slate-900">Day-wise Stops</h3>
              {stopsQuery.isLoading ? <p className="mt-3 text-sm text-slate-600">Loading stops...</p> : null}
              {stops.length === 0 && !stopsQuery.isLoading ? (
                <p className="mt-3 text-sm text-slate-600">No stops yet. Add cities in itinerary builder.</p>
              ) : null}
              <motion.div className="mt-4 grid gap-3" variants={stagger} initial="initial" animate="animate">
                {stops.map((stop) => (
                  <MotionArticle key={stop.id} className="rounded-xl border border-black/8 p-4" variants={itemMotion} whileHover={{ y: -3, scale: 1.005 }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Stop {stop.stopOrder}</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-900">
                      {stop.cityName}, {stop.country}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      Transport {formatCurrency(stop.transportCost, trip.currencyCode)} | Stay{' '}
                      {formatCurrency(stop.stayCost, trip.currencyCode)}
                    </p>
                  </MotionArticle>
                ))}
              </motion.div>
            </MotionSection>

            <AnimatedModal open={Boolean(shareUrl)} title="Share link ready" onClose={() => setShareUrl(null)}>
              <p className="text-sm text-slate-600">Anyone with this link can view the public version of your trip.</p>
              {shareUrl ? (
                <Link className="mt-3 block break-all rounded-xl bg-slate-50 p-3 text-sm font-medium text-teal-700" href={shareUrl} target="_blank">
                  {shareUrl}
                </Link>
              ) : null}
            </AnimatedModal>
          </>
        ) : null}
      </AppShell>
    </AuthGate>
  );
}
