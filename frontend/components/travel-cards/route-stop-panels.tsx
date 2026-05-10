'use client';

import { motion } from 'framer-motion';
import { travelStops, type TravelStop } from '../route-map/travel-route-data';

export function RouteSidebarCards({
  selectedStopId,
  hoveredStopId,
  onSelectStop,
  onHoverStop,
}: {
  selectedStopId: string;
  hoveredStopId: string | null;
  onSelectStop: (id: string) => void;
  onHoverStop: (id: string | null) => void;
}) {
  return (
    <div className="grid gap-3">
      {travelStops.map((stop, index) => (
        <RouteStopCard
          key={stop.id}
          stop={stop}
          active={selectedStopId === stop.id}
          hovered={hoveredStopId === stop.id}
          delay={0.08 * index}
          onSelectStop={onSelectStop}
          onHoverStop={onHoverStop}
        />
      ))}
    </div>
  );
}

function RouteStopCard({
  stop,
  active,
  hovered,
  delay,
  onSelectStop,
  onHoverStop,
}: {
  stop: TravelStop;
  active: boolean;
  hovered: boolean;
  delay: number;
  onSelectStop: (id: string) => void;
  onHoverStop: (id: string | null) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelectStop(stop.id)}
      onMouseEnter={() => onHoverStop(stop.id)}
      onMouseLeave={() => onHoverStop(null)}
      className={`group w-full rounded-[1.5rem] border p-4 text-left backdrop-blur-xl transition-all duration-300 ${
        active
          ? 'border-cyan-300/40 bg-slate-900/12 shadow-[0_0_0_1px_rgba(103,232,249,0.18),0_18px_60px_rgba(8,145,178,0.25)]'
          : hovered
            ? 'border-white/20 bg-slate-900/10 shadow-[0_18px_40px_rgba(8,15,40,0.35)]'
            : 'border-white/10 bg-slate-900/7 shadow-[0_14px_40px_rgba(2,6,23,0.22)]'
      }`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 24 }}
      whileHover={{ y: -2, scale: 1.005 }}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stop.accent} text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(34,211,238,0.22)]`}>
          {stop.thumbnailLabel}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-200">Route Stop</span>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${active ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-slate-900/5 text-slate-200'}`}>
              {stop.country}
            </span>
          </div>
          <div className="mt-2 flex items-start gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold ${active ? 'border-cyan-300/40 bg-cyan-300/15 text-cyan-100' : 'border-white/10 bg-slate-900/5 text-slate-200'}`}>
              {stop.number}
            </div>
            <div className="min-w-0">
              <h3 className="break-words text-[1.05rem] font-semibold tracking-tight text-white">{stop.name}</h3>
              <p className="line-clamp-2 break-words text-sm leading-6 text-slate-300">{stop.summary}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function BottomRouteNavigation({
  selectedStopId,
  hoveredStopId,
  onSelectStop,
  onHoverStop,
}: {
  selectedStopId: string;
  hoveredStopId: string | null;
  onSelectStop: (id: string) => void;
  onHoverStop: (id: string | null) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {travelStops.map((stop, index) => {
        const active = selectedStopId === stop.id;
        const hovered = hoveredStopId === stop.id;
        return (
          <motion.button
            key={stop.id}
            type="button"
            onClick={() => onSelectStop(stop.id)}
            onMouseEnter={() => onHoverStop(stop.id)}
            onMouseLeave={() => onHoverStop(null)}
            className={`min-w-[11rem] rounded-[1.35rem] border px-4 py-3 text-left backdrop-blur-xl transition-all duration-300 sm:min-w-[12rem] ${
              active
                ? 'border-cyan-300/40 bg-cyan-300/12 shadow-[0_0_0_1px_rgba(103,232,249,0.15),0_18px_60px_rgba(8,145,178,0.25)]'
                : hovered
                  ? 'border-white/20 bg-slate-900/10 shadow-[0_16px_40px_rgba(8,15,40,0.34)]'
                  : 'border-white/10 bg-slate-900/7 shadow-[0_10px_30px_rgba(2,6,23,0.18)]'
            }`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.05 * index, type: 'spring', stiffness: 240, damping: 24 }}
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-200">Stop {stop.number}</p>
            <p className="mt-2 break-words text-base font-semibold leading-snug text-white">{stop.name}</p>
            <p className="mt-1 text-xs text-slate-300">{stop.country}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
