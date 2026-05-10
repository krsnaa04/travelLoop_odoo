'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AppShell } from '../../components/app-shell';
import { AuthGate } from '../../components/auth-gate';
import { MotionArticle, MotionSection, itemMotion, stagger } from '../../components/motion';
import { SkeletonBlock } from '../../components/loading-skeleton';
import { publicApi } from '../../lib/api-client';
import { formatDate } from '../../lib/format';

export default function CommunityPage() {
  const feedQuery = useQuery({
    queryKey: ['public-feed'],
    queryFn: publicApi.feed,
  });

  const items = feedQuery.data ?? [];

  return (
    <AuthGate>
      <AppShell title="Community" subtitle="Explore shared itineraries and clone plans into your own account.">
        {feedQuery.isLoading ? (
          <motion.div className="grid gap-4 md:grid-cols-2" variants={stagger} initial="initial" animate="animate">
            {Array.from({ length: 4 }).map((_, index) => (
              <MotionArticle key={index} className="traveloop-card rounded-[1.5rem] p-5 sm:p-6" variants={itemMotion}>
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="mt-3 h-7 w-3/4" />
                <SkeletonBlock className="mt-2 h-4 w-full" />
                <SkeletonBlock className="mt-4 h-9 w-32 rounded-full" />
              </MotionArticle>
            ))}
          </motion.div>
        ) : null}
        {feedQuery.isError ? <p className="text-sm text-rose-600">Could not load public trips right now.</p> : null}
        {items.length === 0 && !feedQuery.isLoading ? <p className="text-sm text-slate-400">No public trips yet.</p> : null}
        <motion.div className="mt-4 grid gap-4" variants={stagger} initial="initial" animate="animate">
          {items.map((item) => (
            <MotionArticle key={item.slug} className="traveloop-card rounded-[1.5rem] p-5 sm:p-6" variants={itemMotion} whileHover={{ y: -4, scale: 1.01 }}>
              <p className="traveloop-kicker text-teal-700">Shared by {item.ownerName || 'Traveler'}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">{item.trip.title}</h2>
              <p className="traveloop-copy mt-2 text-sm">{item.trip.description || 'No description provided.'}</p>
              <p className="mt-2 text-xs text-slate-500">
                {formatDate(item.trip.startDate)} - {formatDate(item.trip.endDate)} | {item.trip.destinationCount} stops
              </p>
              <Link className="traveloop-button-primary mt-4" href={`/public/${item.slug}`}>
                Open itinerary
              </Link>
            </MotionArticle>
          ))}
        </motion.div>
      </AppShell>
    </AuthGate>
  );
}
