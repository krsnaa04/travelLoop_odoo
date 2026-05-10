'use client';

import { motion } from 'framer-motion';

const destinations = [
  {
    name: 'San Francisco',
    country: 'USA',
    x: '16%',
    y: '42%',
    note: 'Start with the Pacific coast',
  },
  {
    name: 'Reykjavik',
    country: 'Iceland',
    x: '41%',
    y: '24%',
    note: 'Add a northern lights layover',
  },
  {
    name: 'Paris',
    country: 'France',
    x: '53%',
    y: '34%',
    note: 'Museum days and long dinners',
  },
  {
    name: 'Dubai',
    country: 'UAE',
    x: '66%',
    y: '45%',
    note: 'Luxury transit hub',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    x: '84%',
    y: '39%',
    note: 'Finish with city energy',
  },
];

const routes = [
  'M 16 42 C 24 34, 30 29, 41 24',
  'M 41 24 C 46 24, 49 28, 53 34',
  'M 53 34 C 58 39, 61 43, 66 45',
  'M 66 45 C 73 44, 79 42, 84 39',
];

function DestinationPin({ destination, index }: { destination: (typeof destinations)[number]; index: number }) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: destination.x, top: destination.y }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: 0.12 * index, type: 'spring', stiffness: 240, damping: 18 }}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-cyan-300/70 blur-md" />
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-200/40" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
      </div>
    </motion.div>
  );
}

export function WorldMapSection() {
  return (
    <section className="traveloop-content px-5 pb-5 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
      <div className="traveloop-card rounded-[1.85rem] p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="traveloop-kicker text-teal-700">Planned destinations</p>
            <h2 className="traveloop-title mt-2 text-2xl font-semibold sm:text-3xl">Glowing travel paths across the world</h2>
            <p className="traveloop-copy mt-3 text-sm sm:text-base">
              See how a multi-city trip flows from continent to continent, with route energy drawn directly into the map preview.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Smart routing', 'Budget-aware', 'Premium preview'].map((pill) => (
              <span key={pill} className="traveloop-pill bg-white/75 text-slate-700">
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            className="traveloop-gradient-panel relative min-h-[22rem] overflow-hidden rounded-[1.75rem] p-4 sm:p-5 lg:min-h-[24rem]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.16),transparent_0_24%),radial-gradient(circle_at_85%_18%,rgba(96,165,250,0.14),transparent_0_20%),radial-gradient(circle_at_75%_78%,rgba(251,191,36,0.12),transparent_0_22%)]" />
            <svg viewBox="0 0 100 56" className="relative h-full w-full" role="img" aria-label="Animated world map with planned travel paths">
              <defs>
                <linearGradient id="traveloop-route" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <radialGradient id="traveloop-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <filter id="traveloop-map-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0.1 0 1 0 0 0.9 0 0 1 0 1 0 0 0 1 0"
                  />
                </filter>
              </defs>

              <rect x="0.8" y="0.8" width="98.4" height="54.4" rx="4" className="fill-transparent stroke-white/12" strokeDasharray="1 2" />

              <g filter="url(#traveloop-map-glow)" className="opacity-85">
                <path d="M11 18 L16 13 L25 12 L29 17 L26 22 L21 23 L15 21 Z" className="fill-white/15 stroke-white/20" />
                <path d="M19 24 L22 28 L25 35 L23 43 L19 48 L14 43 L12 35 L13 28 Z" className="fill-white/15 stroke-white/20" />
                <path d="M37 12 L43 10 L49 13 L50 19 L46 24 L41 23 L37 18 Z" className="fill-white/12 stroke-white/18" />
                <path d="M51 16 L61 14 L67 18 L68 24 L63 28 L55 27 L50 22 Z" className="fill-white/14 stroke-white/18" />
                <path d="M66 22 L74 20 L80 24 L82 30 L78 34 L70 32 L65 27 Z" className="fill-white/15 stroke-white/18" />
                <path d="M77 11 L84 10 L90 14 L89 20 L84 22 L79 19 Z" className="fill-white/13 stroke-white/16" />
                <path d="M70 35 L76 33 L81 36 L80 43 L75 47 L69 43 L67 38 Z" className="fill-white/13 stroke-white/16" />
              </g>

              {routes.map((route, index) => (
                <motion.path
                  key={route}
                  d={route}
                  fill="none"
                  stroke="url(#traveloop-route)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="0.75 1.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: 0.16 * index, duration: 1.4, ease: 'easeInOut' }}
                  className="drop-shadow-[0_0_12px_rgba(103,232,249,0.8)]"
                />
              ))}

              {destinations.map((destination, index) => (
                <DestinationPin key={destination.name} destination={destination} index={index} />
              ))}
            </svg>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
              {destinations.slice(0, 3).map((destination, index) => (
                <motion.div
                  key={destination.name}
                  className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur-md"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: 0.18 * index, type: 'spring', stiffness: 220, damping: 24 }}
                >
                  <p className="text-sm font-semibold">{destination.name}</p>
                  <p className="text-xs text-slate-200">{destination.country}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {destinations.map((destination, index) => (
              <motion.article
                key={destination.name}
                className="traveloop-card rounded-[1.35rem] p-4 sm:p-5"
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.08 * index, type: 'spring', stiffness: 240, damping: 24 }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="traveloop-kicker text-teal-700">Route stop</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">{destination.name}</h3>
                  </div>
                  <span className="traveloop-pill bg-teal-50 text-teal-800">{destination.country}</span>
                </div>
                <p className="traveloop-copy mt-3 text-sm">{destination.note}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}