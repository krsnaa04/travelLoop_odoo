'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AnimatedModal } from './animated-modal';

type PlannerForm = {
  destination: string;
  budget: string;
  days: string;
  interests: string;
};

type ItineraryDay = {
  label: string;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
};

const destinationTemplates = [
  { match: /tokyo|kyoto|japan/i, vibe: 'Neon rail loops and quiet temples', transit: 'JR Pass + local metro' },
  { match: /paris|france/i, vibe: 'Museum mornings and golden-hour promenades', transit: 'Metro + walking loops' },
  { match: /bali|ubud|indonesia/i, vibe: 'Lagoon calm, villas, and sunrise rituals', transit: 'Scooter + private driver' },
  { match: /new york|nyc|usa/i, vibe: 'Iconic city blocks and skyline nights', transit: 'Subway + rideshare' },
  { match: /rome|italy/i, vibe: 'Ancient streets and long aperitivo evenings', transit: 'Walk + regional trains' },
];

const defaultTemplate = { vibe: 'Balanced city rhythm with a premium local-first flow', transit: 'Walk + rideshare + local transit' };

const interestLibrary = [
  { keyword: /food|dining|cafe|coffee/i, morning: 'Book a local breakfast crawl', afternoon: 'Reserve a chef-led tasting', evening: 'Plan a signature dinner reservation' },
  { keyword: /history|museum|culture/i, morning: 'Start with a landmark or museum', afternoon: 'Add a guided cultural tour', evening: 'Leave space for a heritage district walk' },
  { keyword: /nature|hike|outdoors|beach/i, morning: 'Anchor the day with an outdoor view point', afternoon: 'Add a scenic route or park loop', evening: 'Close with a sunset stop' },
  { keyword: /shopping|fashion|design/i, morning: 'Start in a design district', afternoon: 'Visit a curated market or flagship store', evening: 'Reserve a rooftop or lounge stop' },
  { keyword: /nightlife|music|party/i, morning: 'Keep the morning light', afternoon: 'Use the afternoon for recovery and exploration', evening: 'Feature a nightlife anchor' },
];

function clampNumber(value: string, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function splitInterests(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function widthClass(value: number, budget: number) {
  const percent = Math.max(18, Math.round((value / budget) * 100));
  if (percent >= 90) return 'w-full';
  if (percent >= 75) return 'w-5/6';
  if (percent >= 60) return 'w-3/4';
  if (percent >= 45) return 'w-2/3';
  if (percent >= 30) return 'w-1/2';
  return 'w-1/3';
}

function buildDay(destination: string, dayIndex: number, interests: string[], vibe: string): ItineraryDay {
  const focus = interests[dayIndex % Math.max(1, interests.length)] ?? 'local discovery';
  const interestPlan =
    interestLibrary.find((entry) => entry.keyword.test(focus)) ??
    interestLibrary[dayIndex % interestLibrary.length] ??
    interestLibrary[0];

  return {
    label: `Day ${dayIndex + 1}`,
    theme: dayIndex === 0 ? `Arrival in ${destination || 'your destination'}` : `${focus} focus in ${destination || 'the city'}`,
    morning: dayIndex === 0 ? `Check in, then take a soft orientation walk through ${destination || 'the city center'}.` : interestPlan.morning,
    afternoon: `${interestPlan.afternoon} with ${vibe.toLowerCase()}.`,
    evening: dayIndex === 0 ? 'Plan a relaxed welcome dinner and early night.' : interestPlan.evening,
  };
}

export function AiTripPlannerModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PlannerForm>({
    destination: 'Tokyo',
    budget: '3500',
    days: '5',
    interests: 'food, culture, nightlife',
  });

  const preview = useMemo(() => {
    const days = clampNumber(form.days, 5, 2, 10);
    const budget = clampNumber(form.budget, 3500, 500, 50000);
    const interests = splitInterests(form.interests);
    const template = destinationTemplates.find((entry) => entry.match.test(form.destination)) ?? defaultTemplate;
    const budgetPerDay = Math.round(budget / days);
    const lodgingShare = Math.round(budget * 0.42);
    const foodShare = Math.round(budget * 0.2);
    const activityShare = Math.round(budget * 0.24);
    const transitShare = Math.max(0, budget - lodgingShare - foodShare - activityShare);

    return {
      days,
      budget,
      interests,
      template,
      budgetPerDay,
      allocation: [
        { label: 'Stay', value: lodgingShare, tone: 'bg-teal-500' },
        { label: 'Food', value: foodShare, tone: 'bg-amber-400' },
        { label: 'Experiences', value: activityShare, tone: 'bg-sky-400' },
        { label: 'Transit', value: transitShare, tone: 'bg-violet-400' },
      ],
      daysPlan: Array.from({ length: days }, (_, index) => buildDay(form.destination, index, interests, template.vibe)),
    };
  }, [form.budget, form.days, form.destination, form.interests]);

  return (
    <>
      <button className="traveloop-button-primary" type="button" onClick={() => setOpen(true)}>
        Try AI Trip Planner
      </button>

      <AnimatedModal open={open} title="AI Trip Planner" onClose={() => setOpen(false)}>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <div className="space-y-4">
            <p className="traveloop-copy text-sm">
              Enter a destination, budget, trip length, and a few interests. Traveloop will shape a premium itinerary preview instantly.
            </p>
            <div className="grid gap-3">
              <input
                className="traveloop-input"
                placeholder="Destination"
                value={form.destination}
                onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="traveloop-input"
                  placeholder="Budget"
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
                />
                <input
                  className="traveloop-input"
                  placeholder="Number of days"
                  type="number"
                  min={1}
                  max={14}
                  value={form.days}
                  onChange={(event) => setForm((current) => ({ ...current, days: event.target.value }))}
                />
              </div>
              <textarea
                className="traveloop-input min-h-28"
                placeholder="Interests, separated by commas"
                value={form.interests}
                onChange={(event) => setForm((current) => ({ ...current, interests: event.target.value }))}
              />
            </div>

            <div className="traveloop-card rounded-[1.35rem] p-4 sm:p-5">
              <p className="traveloop-kicker text-teal-700">Planner intelligence</p>
              <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-900/70 p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tone</p>
                  <p className="mt-2 font-semibold text-slate-100 leading-5">{preview.template.vibe}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/70 p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Transit</p>
                  <p className="mt-2 font-semibold text-slate-100 leading-5">{preview.template.transit}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/70 p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Daily</p>
                  <p className="mt-2 font-semibold text-slate-100 leading-5">${preview.budgetPerDay.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.div
              className="traveloop-gradient-panel rounded-[1.5rem] p-4 text-white sm:p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-200">Smart itinerary preview</p>
              <h3 className="mt-3 text-2xl font-semibold sm:text-[2.15rem]">{form.destination || 'Your destination'}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {preview.days} days | Budget ${preview.budget.toLocaleString()} | {preview.interests.length || 0} interest signals detected
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {preview.allocation.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/10 p-3 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-white">{item.label}</span>
                      <span className="text-slate-100">${item.value.toLocaleString()}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-900/10">
                      <div className={`h-2 rounded-full ${item.tone} ${widthClass(item.value, preview.budget)}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {preview.daysPlan.map((day) => (
                <motion.article
                  key={day.label}
                  className="traveloop-card rounded-[1.35rem] p-4 sm:p-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="traveloop-kicker text-teal-700">{day.label}</p>
                      <h4 className="mt-1 text-lg font-semibold text-slate-100 sm:text-xl">{day.theme}</h4>
                    </div>
                    <span className="traveloop-pill w-fit bg-teal-50 text-teal-800">${Math.round(preview.budget / preview.days).toLocaleString()}</span>
                  </div>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                    <p>
                      <span className="font-semibold text-slate-100">Morning:</span> {day.morning}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">Afternoon:</span> {day.afternoon}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">Evening:</span> {day.evening}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}