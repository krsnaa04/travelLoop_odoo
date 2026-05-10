'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AppShell } from '../../components/app-shell';
import { AuthGate } from '../../components/auth-gate';
import { catalogApi } from '../../lib/api-client';

export default function ActivitiesPage() {
  const [queryText, setQueryText] = useState('');
  const [category, setCategory] = useState('');

  const activitiesQuery = useQuery({
    queryKey: ['activities-screen', queryText, category],
    queryFn: () =>
      catalogApi.activities({
        q: queryText || undefined,
        category: category || undefined,
        limit: 50,
      }),
  });

  const activities = activitiesQuery.data ?? [];

  return (
    <AuthGate>
      <AppShell title="Activity Search" subtitle="Browse curated activities by category, city, and estimated cost.">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2"
            placeholder="Search activity"
            value={queryText}
            onChange={(event) => setQueryText(event.target.value)}
          />
          <input
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2"
            placeholder="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">Use itinerary builder to assign selected activities to trip stops.</p>
        <div className="mt-4 grid gap-3">
          {activities.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/8 bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-teal-700">{item.category}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-100">{item.title}</h2>
              <p className="text-sm text-slate-400">{item.cityName || 'Multi-city activity'}</p>
              <p className="mt-2 text-xs text-slate-400">
                Duration {item.defaultDurationMinutes} min | Est. cost {item.estimatedCost} | Popularity {item.popularityScore}
              </p>
              <p className="mt-2 text-sm text-slate-300">{item.description || 'No description available.'}</p>
            </article>
          ))}
        </div>
      </AppShell>
    </AuthGate>
  );
}
