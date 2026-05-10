'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AppShell } from '../../components/app-shell';
import { AuthGate } from '../../components/auth-gate';
import { catalogApi } from '../../lib/api-client';

export default function CitiesPage() {
  const [queryText, setQueryText] = useState('');
  const [country, setCountry] = useState('');

  const citiesQuery = useQuery({
    queryKey: ['cities-screen', queryText, country],
    queryFn: () =>
      catalogApi.cities({
        q: queryText || undefined,
        country: country || undefined,
        limit: 50,
      }),
  });

  const cities = citiesQuery.data ?? [];

  return (
    <AuthGate>
      <AppShell title="City Search" subtitle="Discover destinations with cost index and meal estimates before adding stops.">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2"
            placeholder="Search city"
            value={queryText}
            onChange={(event) => setQueryText(event.target.value)}
          />
          <input
            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2"
            placeholder="Filter by country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">Use itinerary builder to add selected cities to specific trips.</p>
        <div className="mt-4 grid gap-3">
          {cities.map((city) => (
            <article key={city.id} className="rounded-xl border border-white/8 bg-slate-900 p-4">
              <h2 className="text-lg font-semibold text-slate-100">
                {city.name}, {city.country}
              </h2>
              <p className="text-sm text-slate-400">{city.region || 'Region not specified'}</p>
              <p className="mt-2 text-xs text-slate-400">
                Popularity {city.popularityScore} | Cost index {city.costIndex} | Daily meals estimate {city.dailyMealEstimate}
              </p>
              <p className="mt-2 text-sm text-slate-300">{city.description || 'No city notes yet.'}</p>
            </article>
          ))}
        </div>
      </AppShell>
    </AuthGate>
  );
}
