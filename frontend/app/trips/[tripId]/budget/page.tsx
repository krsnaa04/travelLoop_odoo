'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '../../../../components/app-shell';
import { AuthGate } from '../../../../components/auth-gate';
import { MotionArticle, MotionSection, itemMotion, stagger } from '../../../../components/motion';
import { SkeletonBlock } from '../../../../components/loading-skeleton';
import { tripApi } from '../../../../lib/api-client';
import { formatCurrency, formatDate } from '../../../../lib/format';

export default function TripBudgetPage() {
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;

  const budgetQuery = useQuery({
    queryKey: ['trip-budget', tripId],
    queryFn: () => tripApi.budget(tripId),
  });

  const data = budgetQuery.data;

  return (
    <AuthGate>
      <AppShell title="Trip Budget & Cost Breakdown" subtitle="Understand category spend, daily totals, and over-budget days.">
        <motion.div className="flex gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
          <Link className="rounded-full border border-white/10 px-3 py-1 text-sm" href={`/trips/${tripId}`}>
            Back to itinerary
          </Link>
          <Link className="rounded-full border border-white/10 px-3 py-1 text-sm" href={`/trips/${tripId}/builder`}>
            Open builder
          </Link>
        </motion.div>
        {budgetQuery.isLoading ? (
          <motion.div className="mt-6 space-y-4" variants={stagger} initial="initial" animate="animate">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <MotionArticle key={index} className="rounded-xl border border-white/8 bg-slate-900 p-4" variants={itemMotion}>
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="mt-3 h-7 w-24" />
                </MotionArticle>
              ))}
            </div>
            <MotionSection className="rounded-2xl border border-white/8 bg-slate-900 p-5" variants={itemMotion}>
              <SkeletonBlock className="h-5 w-40" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-20 rounded-xl" />
                ))}
              </div>
            </MotionSection>
          </motion.div>
        ) : null}
        {budgetQuery.isError ? <p className="mt-6 text-sm text-rose-600">Could not load budget data.</p> : null}
        {data ? (
          <>
            <motion.section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" variants={stagger} initial="initial" animate="animate">
              {[
                ['Transport', data.totals.transport],
                ['Stay', data.totals.stay],
                ['Meals', data.totals.meals],
                ['Activities', data.totals.activities],
                ['Total', data.totals.total],
              ].map(([label, value]) => (
                <MotionArticle key={label} className="rounded-xl border border-white/8 bg-slate-900 p-4" variants={itemMotion} whileHover={{ y: -4, scale: 1.01 }}>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-100">
                    {formatCurrency(Number(value), data.currencyCode)}
                  </p>
                </MotionArticle>
              ))}
            </motion.section>

            <MotionSection className="mt-6 rounded-2xl border border-white/8 bg-slate-900 p-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
              <h2 className="text-lg font-semibold text-slate-100">Daily Breakdown</h2>
              <p className="mt-2 text-sm text-slate-400">
                Budget target/day:{' '}
                <strong>{formatCurrency(data.dailyBudgetTarget, data.currencyCode)}</strong> | Average/day:{' '}
                <strong>{formatCurrency(data.averageCostPerDay, data.currencyCode)}</strong>
              </p>
              <motion.div className="mt-4 space-y-3" variants={stagger} initial="initial" animate="animate">
                {data.dailyBreakdown.map((day) => (
                  <MotionArticle
                    key={day.date}
                    className={`rounded-xl border p-4 ${
                      day.overBudget ? 'border-rose-200 bg-rose-50' : 'border-white/8 bg-slate-900/50'
                    }`}
                    variants={itemMotion}
                    whileHover={{ y: -2, scale: 1.005 }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-slate-100">{formatDate(day.date)}</p>
                      <p className={`text-sm font-semibold ${day.overBudget ? 'text-rose-700' : 'text-slate-200'}`}>
                        {formatCurrency(day.total, data.currencyCode)}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Transport {formatCurrency(day.transport, data.currencyCode)} | Stay {formatCurrency(day.stay, data.currencyCode)} | Meals{' '}
                      {formatCurrency(day.meals, data.currencyCode)} | Activities {formatCurrency(day.activities, data.currencyCode)}
                    </p>
                  </MotionArticle>
                ))}
              </motion.div>
            </MotionSection>
          </>
        ) : null}
      </AppShell>
    </AuthGate>
  );
}
