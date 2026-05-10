'use client';

import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AppShell } from '../../../../components/app-shell';
import { AuthGate } from '../../../../components/auth-gate';
import { MotionArticle, MotionSection, itemMotion, stagger } from '../../../../components/motion';
import { SkeletonBlock } from '../../../../components/loading-skeleton';
import { catalogApi, tripApi } from '../../../../lib/api-client';
import { formatCurrency, formatDate } from '../../../../lib/format';

export default function ItineraryBuilderPage() {
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;
  const queryClient = useQueryClient();

  const [cityQuery, setCityQuery] = useState('');
  const [stopForm, setStopForm] = useState({
    cityId: '',
    startDate: '',
    endDate: '',
    transportCost: 0,
    stayCost: 0,
    notes: '',
  });
  const [activitySearch, setActivitySearch] = useState('');
  const [activityForm, setActivityForm] = useState({
    stopId: '',
    activityCatalogId: '',
    title: '',
    category: '',
    scheduledDate: '',
    scheduledTime: '',
    durationMinutes: 60,
    estimatedCost: 0,
    description: '',
  });

  const tripQuery = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripApi.get(tripId),
  });

  const stopsQuery = useQuery({
    queryKey: ['trip-stops', tripId],
    queryFn: () => tripApi.listStops(tripId),
  });

  const citiesQuery = useQuery({
    queryKey: ['city-search', cityQuery],
    queryFn: () => catalogApi.cities({ q: cityQuery, limit: 20 }),
    enabled: cityQuery.length > 0,
  });

  const activityCatalogQuery = useQuery({
    queryKey: ['activity-catalog', activitySearch, activityForm.stopId],
    queryFn: () => {
      const stop = (stopsQuery.data ?? []).find((item) => item.id === activityForm.stopId);
      return catalogApi.activities({
        q: activitySearch,
        cityId: stop?.cityId,
        limit: 20,
      });
    },
    enabled: activitySearch.length > 0 && Boolean(activityForm.stopId),
  });

  const activityQueries = useQueries({
    queries: (stopsQuery.data ?? []).map((stop) => ({
      queryKey: ['stop-activities', stop.id],
      queryFn: () => tripApi.listActivities(stop.id),
      enabled: Boolean(stop.id),
    })),
  });

  const activitiesByStop = useMemo(() => {
    const map = new Map<string, ReturnType<typeof tripApi.listActivities> extends Promise<infer U> ? U : never>();
    (stopsQuery.data ?? []).forEach((stop, index) => {
      map.set(stop.id, activityQueries[index]?.data ?? []);
    });
    return map;
  }, [activityQueries, stopsQuery.data]);

  const invalidateTrip = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] }),
      queryClient.invalidateQueries({ queryKey: ['trip-stops', tripId] }),
      queryClient.invalidateQueries({ queryKey: ['trips'] }),
      queryClient.invalidateQueries({ queryKey: ['trip-budget', tripId] }),
    ]);
  };

  const addStopMutation = useMutation({
    mutationFn: () => tripApi.addStop(tripId, stopForm),
    onSuccess: async () => {
      setStopForm({
        cityId: '',
        startDate: '',
        endDate: '',
        transportCost: 0,
        stayCost: 0,
        notes: '',
      });
      await invalidateTrip();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (stopIds: string[]) => tripApi.reorderStops(tripId, stopIds),
    onSuccess: invalidateTrip,
  });

  const deleteStopMutation = useMutation({
    mutationFn: (stopId: string) => tripApi.removeStop(stopId),
    onSuccess: invalidateTrip,
  });

  const addActivityMutation = useMutation({
    mutationFn: () =>
      tripApi.addActivity(activityForm.stopId, {
        activityCatalogId: activityForm.activityCatalogId || null,
        title: activityForm.title,
        category: activityForm.category,
        scheduledDate: activityForm.scheduledDate,
        scheduledTime: activityForm.scheduledTime || null,
        durationMinutes: activityForm.durationMinutes,
        estimatedCost: activityForm.estimatedCost,
        description: activityForm.description || null,
      }),
    onSuccess: async () => {
      const stopId = activityForm.stopId;
      setActivityForm({
        stopId,
        activityCatalogId: '',
        title: '',
        category: '',
        scheduledDate: '',
        scheduledTime: '',
        durationMinutes: 60,
        estimatedCost: 0,
        description: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['stop-activities', stopId] });
      await queryClient.invalidateQueries({ queryKey: ['trip-budget', tripId] });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (activityId: string) => tripApi.removeActivity(activityId),
    onSuccess: async () => {
      await Promise.all([
        ...((stopsQuery.data ?? []).map((stop) => queryClient.invalidateQueries({ queryKey: ['stop-activities', stop.id] }))),
      ]);
      await queryClient.invalidateQueries({ queryKey: ['trip-budget', tripId] });
    },
  });

  const trip = tripQuery.data;
  const stops = stopsQuery.data ?? [];

  const moveStop = (stopId: string, direction: -1 | 1) => {
    const currentIndex = stops.findIndex((stop) => stop.id === stopId);
    if (currentIndex < 0) return;
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const reordered = [...stops];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    reorderMutation.mutate(reordered.map((stop) => stop.id));
  };

  const selectedStop = stops.find((stop) => stop.id === activityForm.stopId);

  return (
    <AuthGate>
      <AppShell title={trip ? `${trip.title} Builder` : 'Itinerary Builder'} subtitle="Add cities, schedule dates, attach activities, and reorder stops quickly.">
        <motion.div className="flex gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
          <Link className="rounded-full border border-black/10 px-3 py-1 text-sm" href={`/trips/${tripId}`}>
            View itinerary
          </Link>
          <Link className="rounded-full border border-black/10 px-3 py-1 text-sm" href={`/trips/${tripId}/budget`}>
            Open budget
          </Link>
        </motion.div>

        <MotionSection className="mt-6 rounded-2xl border border-black/8 bg-white p-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
          <h2 className="text-lg font-semibold text-slate-900">Add Stop</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <input
                className="w-full rounded-xl border border-black/10 px-4 py-2"
                placeholder="Search city (Paris, Tokyo...)"
                value={cityQuery}
                onChange={(event) => setCityQuery(event.target.value)}
              />
              {citiesQuery.data && citiesQuery.data.length > 0 ? (
                <div className="mt-2 max-h-40 space-y-1 overflow-auto rounded-xl border border-black/10 bg-white p-2">
                  {citiesQuery.data.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                        stopForm.cityId === city.id ? 'bg-teal-50 text-teal-700' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setStopForm((current) => ({ ...current, cityId: city.id }))}
                    >
                      {city.name}, {city.country} | cost index {city.costIndex}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="date"
              title="Start date"
              value={stopForm.startDate}
              onChange={(event) => setStopForm((current) => ({ ...current, startDate: event.target.value }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="date"
              title="End date"
              value={stopForm.endDate}
              onChange={(event) => setStopForm((current) => ({ ...current, endDate: event.target.value }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="number"
              min={0}
              step="0.01"
              placeholder="Transport cost"
              title="Transport cost"
              value={stopForm.transportCost}
              onChange={(event) => setStopForm((current) => ({ ...current, transportCost: Number(event.target.value) }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="number"
              min={0}
              step="0.01"
              placeholder="Stay cost"
              title="Stay cost"
              value={stopForm.stayCost}
              onChange={(event) => setStopForm((current) => ({ ...current, stayCost: Number(event.target.value) }))}
            />
            <textarea
              className="min-h-20 rounded-xl border border-black/10 px-4 py-2 md:col-span-2"
              placeholder="Optional stop notes"
              title="Optional stop notes"
              value={stopForm.notes}
              onChange={(event) => setStopForm((current) => ({ ...current, notes: event.target.value }))}
            />
            <button
              className="rounded-xl bg-teal-700 px-4 py-2 font-medium text-white md:col-span-2"
              type="button"
              disabled={addStopMutation.isPending}
              onClick={() => addStopMutation.mutate()}
            >
              {addStopMutation.isPending ? 'Adding stop...' : 'Add stop'}
            </button>
          </div>
        </MotionSection>

        <MotionSection className="mt-6 rounded-2xl border border-black/8 bg-white p-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
          <h2 className="text-lg font-semibold text-slate-900">Add Activity</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              className="rounded-xl border border-black/10 px-4 py-2"
              title="Select stop"
              value={activityForm.stopId}
              onChange={(event) => setActivityForm((current) => ({ ...current, stopId: event.target.value }))}
            >
              <option value="">Select stop</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  Stop {stop.stopOrder}: {stop.cityName}
                </option>
              ))}
            </select>
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              placeholder="Search activity templates"
              title="Search activity templates"
              value={activitySearch}
              onChange={(event) => setActivitySearch(event.target.value)}
            />
            {activityCatalogQuery.data && activityCatalogQuery.data.length > 0 ? (
              <div className="max-h-36 space-y-1 overflow-auto rounded-xl border border-black/10 bg-white p-2 md:col-span-2">
                {activityCatalogQuery.data.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() =>
                      setActivityForm((current) => ({
                        ...current,
                        activityCatalogId: item.id,
                        title: item.title,
                        category: item.category,
                        durationMinutes: item.defaultDurationMinutes,
                        estimatedCost: item.estimatedCost,
                      }))
                    }
                  >
                    {item.title} ({item.category}) - {selectedStop ? formatCurrency(item.estimatedCost, trip?.currencyCode ?? 'USD') : item.estimatedCost}
                  </button>
                ))}
              </div>
            ) : null}
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              placeholder="Activity title"
              title="Activity title"
              value={activityForm.title}
              onChange={(event) => setActivityForm((current) => ({ ...current, title: event.target.value }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              placeholder="Category"
              title="Category"
              value={activityForm.category}
              onChange={(event) => setActivityForm((current) => ({ ...current, category: event.target.value }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="date"
              title="Activity scheduled date"
              value={activityForm.scheduledDate}
              min={selectedStop?.startDate}
              max={selectedStop?.endDate}
              onChange={(event) => setActivityForm((current) => ({ ...current, scheduledDate: event.target.value }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="time"
              title="Activity scheduled time"
              value={activityForm.scheduledTime}
              onChange={(event) => setActivityForm((current) => ({ ...current, scheduledTime: event.target.value }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="number"
              min={1}
              placeholder="Duration (minutes)"
              title="Duration in minutes"
              value={activityForm.durationMinutes}
              onChange={(event) => setActivityForm((current) => ({ ...current, durationMinutes: Number(event.target.value) }))}
            />
            <input
              className="rounded-xl border border-black/10 px-4 py-2"
              type="number"
              min={0}
              step="0.01"
              placeholder="Estimated cost"
              title="Estimated cost"
              value={activityForm.estimatedCost}
              onChange={(event) => setActivityForm((current) => ({ ...current, estimatedCost: Number(event.target.value) }))}
            />
            <textarea
              className="min-h-20 rounded-xl border border-black/10 px-4 py-2 md:col-span-2"
              placeholder="Description"
              title="Description"
              value={activityForm.description}
              onChange={(event) => setActivityForm((current) => ({ ...current, description: event.target.value }))}
            />
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white md:col-span-2"
              type="button"
              disabled={addActivityMutation.isPending}
              onClick={() => addActivityMutation.mutate()}
            >
              {addActivityMutation.isPending ? 'Adding activity...' : 'Add activity'}
            </button>
          </div>
        </MotionSection>

        <MotionSection className="mt-6 rounded-2xl border border-black/8 bg-white p-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
          <h2 className="text-lg font-semibold text-slate-900">Stops & Activities</h2>
          {stopsQuery.isLoading ? (
            <motion.div className="mt-4 grid gap-4" variants={stagger} initial="initial" animate="animate">
              {Array.from({ length: 3 }).map((_, index) => (
                <MotionArticle key={index} className="rounded-xl border border-black/8 p-4" variants={itemMotion}>
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="mt-3 h-6 w-2/3" />
                  <SkeletonBlock className="mt-2 h-4 w-1/2" />
                  <SkeletonBlock className="mt-4 h-28 rounded-xl" />
                </MotionArticle>
              ))}
            </motion.div>
          ) : null}
          {stops.length === 0 && !stopsQuery.isLoading ? (
            <p className="mt-3 text-sm text-slate-600">No stops yet. Add your first city stop above.</p>
          ) : null}
          <motion.div className="mt-4 grid gap-4" variants={stagger} initial="initial" animate="animate">
            {stops.map((stop) => {
              const activities = activitiesByStop.get(stop.id) ?? [];
              return (
                <MotionArticle key={stop.id} className="rounded-xl border border-black/8 p-4" variants={itemMotion} whileHover={{ y: -3, scale: 1.005 }}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Stop {stop.stopOrder}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {stop.cityName}, {stop.country}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        Transport {formatCurrency(stop.transportCost, trip?.currencyCode ?? 'USD')} | Stay{' '}
                        {formatCurrency(stop.stayCost, trip?.currencyCode ?? 'USD')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-full border border-black/10 px-3 py-1 text-xs" type="button" onClick={() => moveStop(stop.id, -1)}>
                        Move up
                      </button>
                      <button className="rounded-full border border-black/10 px-3 py-1 text-xs" type="button" onClick={() => moveStop(stop.id, 1)}>
                        Move down
                      </button>
                      <button
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-700"
                        type="button"
                        onClick={() => deleteStopMutation.mutate(stop.id)}
                      >
                        Delete stop
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-700">Activities</p>
                    {activities.length === 0 ? <p className="mt-1 text-sm text-slate-500">No activities for this stop yet.</p> : null}
                    <div className="mt-2 space-y-2">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-2">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {activity.title} <span className="text-slate-500">({activity.category})</span>
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDate(activity.scheduledDate)} {activity.scheduledTime ? `at ${activity.scheduledTime}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700">
                              {formatCurrency(activity.estimatedCost, trip?.currencyCode ?? 'USD')}
                            </span>
                            <button
                              className="rounded-full border border-rose-200 px-2 py-1 text-xs text-rose-700"
                              type="button"
                              onClick={() => deleteActivityMutation.mutate(activity.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionArticle>
              );
            })}
          </motion.div>
        </MotionSection>
      </AppShell>
    </AuthGate>
  );
}
