'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AnimatedModal } from '../../../components/animated-modal';
import { MotionArticle, MotionSection, itemMotion, stagger } from '../../../components/motion';
import { SkeletonBlock } from '../../../components/loading-skeleton';
import { publicApi } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/auth-store';
import { formatCurrency, formatDate } from '../../../lib/format';

export default function PublicTripPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const token = useAuthStore((state) => state.token);

  const publicQuery = useQuery({
    queryKey: ['public-trip', slug],
    queryFn: () => publicApi.trip(slug),
  });

  const copyMutation = useMutation({
    mutationFn: () => publicApi.copy(slug),
    onSuccess: (result) => {
      router.push(`/trips/${result.tripId}/builder`);
    },
  });

  const data = publicQuery.data;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <motion.section className="traveloop-shell rounded-[2rem] p-6 sm:p-8" initial={{ opacity: 0, y: 14, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">Public itinerary</p>
        {publicQuery.isLoading ? (
          <motion.div className="mt-4 space-y-4" initial="initial" animate="animate">
            <SkeletonBlock className="h-10 w-2/3" />
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-4 w-full" />
            <div className="grid gap-3 sm:grid-cols-2">
              <SkeletonBlock className="h-24 rounded-2xl" />
              <SkeletonBlock className="h-24 rounded-2xl" />
            </div>
          </motion.div>
        ) : null}
        {publicQuery.isError ? <p className="mt-4 text-sm text-rose-600">Could not load this shared trip.</p> : null}
        {data ? (
          <>
            <MotionSection className="mt-3" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
              <h1 className="text-3xl font-semibold text-slate-100">{data.trip.title}</h1>
              <p className="mt-2 text-sm text-slate-400">Shared by {data.ownerName || 'Traveler'}</p>
              <p className="mt-2 text-sm text-slate-400">{data.trip.description || 'No description.'}</p>
              <p className="mt-2 text-xs text-slate-500">
                {formatDate(data.trip.startDate)} - {formatDate(data.trip.endDate)} | {data.stops.length} stops
              </p>
              <motion.div className="mt-4 flex gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
                <button
                  className="rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                  type="button"
                  onClick={() => {
                    if (!token) {
                      router.push('/auth/login');
                      return;
                    }
                    copyMutation.mutate();
                  }}
                  disabled={copyMutation.isPending}
                >
                  {copyMutation.isPending ? 'Copying...' : 'Copy Trip'}
                </button>
                <Link className="rounded-full border border-white/10 px-4 py-2 text-sm" href="/community">
                  Back to community
                </Link>
              </motion.div>
            </MotionSection>

            <motion.div className="mt-6 grid gap-3" variants={stagger} initial="initial" animate="animate">
              {data.stops.map((stop) => {
                const activities = data.activities.filter((activity) => activity.stopId === stop.id);
                return (
                  <MotionArticle key={stop.id} className="rounded-xl border border-white/8 bg-slate-900 p-4" variants={itemMotion} whileHover={{ y: -3, scale: 1.005 }}>
                    <h2 className="text-lg font-semibold text-slate-100">
                      Stop {stop.stopOrder}: {stop.cityName}, {stop.country}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Transport {formatCurrency(stop.transportCost, data.trip.currencyCode)} | Stay{' '}
                      {formatCurrency(stop.stayCost, data.trip.currencyCode)}
                    </p>
                    <div className="mt-3 space-y-2">
                      {activities.length === 0 ? (
                        <p className="text-sm text-slate-500">No activities listed.</p>
                      ) : (
                        activities.map((activity) => (
                          <div key={activity.id} className="rounded-lg bg-slate-900/50 p-2">
                            <p className="text-sm font-medium text-slate-100">
                              {activity.title} ({activity.category})
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatDate(activity.scheduledDate)} {activity.scheduledTime ? `at ${activity.scheduledTime}` : ''} |{' '}
                              {formatCurrency(activity.estimatedCost, data.trip.currencyCode)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </MotionArticle>
                );
              })}
            </motion.div>
          </>
        ) : null}
      </motion.section>
    </main>
  );
}
