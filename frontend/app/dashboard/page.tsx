'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AppShell } from '../../components/app-shell';
import { AuthGate } from '../../components/auth-gate';
import { MotionArticle, MotionSection, itemMotion, stagger } from '../../components/motion';
import { SkeletonBlock } from '../../components/loading-skeleton';
import { TravelRouteVisualization } from '../../components/route-map/travel-route-visualization';
import { EmptyState } from '../../components/empty-state';
import { tripApi } from '../../lib/api-client';
import { formatCurrency, formatDate } from '../../lib/format';

export default function DashboardPage() {
  const tripsQuery = useQuery({
    queryKey: ['trips'],
    queryFn: tripApi.list,
  });

  const trips = tripsQuery.data ?? [];
  const isEmpty = !tripsQuery.isLoading && !tripsQuery.isError && trips.length === 0;
  const nextTrip = [...trips]
    .filter((trip) => trip.startDate)
    .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))[0];
  const avgBudget = trips.length > 0 ? trips.reduce((sum, trip) => sum + trip.budget, 0) / trips.length : 0;

  return (
    <AuthGate>
      <AppShell title="Dashboard" subtitle="Stay on top of upcoming trips, costs, and quick actions.">
        <motion.div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]" variants={stagger} initial="initial" animate="animate">
          <MotionSection
            className="traveloop-gradient-panel rounded-[1.75rem] p-6 text-white sm:p-7"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            whileHover={{ y: -4 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200">Command center</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Keep every trip, budget, and stop in one premium workspace.</h2>
            <p className="traveloop-copy mt-4 max-w-2xl text-slate-200">
              Build multi-city itineraries, search activities, and keep every stop budget-aware.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/trips/new" className="traveloop-button-secondary bg-slate-900/95">
                Plan new trip
              </Link>
              <Link href="/trips" className="traveloop-pill border-white/10 bg-slate-900/10 text-white backdrop-blur-sm">
                View trip library
              </Link>
            </div>
          </MotionSection>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <MotionArticle className="traveloop-card rounded-[1.35rem] p-4" variants={itemMotion} whileHover={{ y: -4, scale: 1.01 }}>
              <p className="text-sm font-medium text-slate-500">Total trips</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">{trips.length}</p>
            </MotionArticle>
            <MotionArticle className="traveloop-card rounded-[1.35rem] p-4" variants={itemMotion} whileHover={{ y: -4, scale: 1.01 }}>
              <p className="text-sm font-medium text-slate-500">Upcoming trip</p>
              <p className="mt-2 text-xl font-semibold text-slate-100">{nextTrip ? nextTrip.title : 'None yet'}</p>
              <p className="mt-1 text-xs text-slate-500">{nextTrip ? formatDate(nextTrip.startDate) : 'Create one now'}</p>
            </MotionArticle>
            <MotionArticle className="traveloop-card rounded-[1.35rem] p-4" variants={itemMotion} whileHover={{ y: -4, scale: 1.01 }}>
              <p className="text-sm font-medium text-slate-500">Average budget</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">
                {nextTrip ? formatCurrency(avgBudget, nextTrip.currencyCode) : formatCurrency(avgBudget, 'USD')}
              </p>
            </MotionArticle>
          </div>
        </motion.div>

        {isEmpty ? (
          <div className="mt-6">
            <EmptyState
              title="No trips yet"
              description="Start planning your first adventure. Your trips, itineraries, journals, budgets, and packing lists will stay private to your account."
              ctaLabel="Create Trip"
              ctaHref="/trips/new"
            />
          </div>
        ) : (
          <TravelRouteVisualization />
        )}

        <MotionSection
          className="mt-6 rounded-[1.75rem] border border-white/8 bg-slate-900/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="traveloop-kicker text-teal-700">Recent trips</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-100">Your latest itineraries</h3>
            </div>
            <Link className="traveloop-pill" href="/trips">
              View all
            </Link>
          </div>
          {tripsQuery.isLoading ? (
            <motion.div className="mt-5 grid gap-4 md:grid-cols-2" variants={stagger} initial="initial" animate="animate">
              {Array.from({ length: 4 }).map((_, index) => (
                <MotionArticle key={index} className="traveloop-card rounded-[1.4rem] p-4" variants={itemMotion}>
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="mt-3 h-6 w-2/3" />
                  <SkeletonBlock className="mt-2 h-4 w-1/2" />
                  <div className="mt-4 flex gap-2">
                    <SkeletonBlock className="h-9 w-28 rounded-full" />
                    <SkeletonBlock className="h-9 w-20 rounded-full" />
                  </div>
                </MotionArticle>
              ))}
            </motion.div>
          ) : null}
          {tripsQuery.isError ? <p className="mt-5 text-sm text-rose-600">Could not load trips right now.</p> : null}
          {isEmpty ? (
            <p className="mt-5 text-sm text-slate-500">Your dashboard is waiting for your first private trip.</p>
          ) : null}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {trips.slice(0, 4).map((trip) => (
              <MotionArticle key={trip.id} className="traveloop-card rounded-[1.4rem] p-4" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }} whileHover={{ y: -4, scale: 1.01 }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-100">{trip.title}</h4>
                  </div>
                  <span className="traveloop-pill bg-teal-50 text-teal-800">{trip.destinationCount} stops</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="traveloop-button-secondary px-3 py-2 text-xs" href={`/trips/${trip.id}`}>
                    View itinerary
                  </Link>
                  <Link className="traveloop-button-primary px-3 py-2 text-xs" href={`/trips/${trip.id}/builder`}>
                    Builder
                  </Link>
                </div>
              </MotionArticle>
            ))}
          </div>
        </MotionSection>
      </AppShell>
    </AuthGate>
  );
}
