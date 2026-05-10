'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FlightPathOverlay } from '../animated-paths/flight-path-overlay';
import { InteractiveGlobe } from '../globe/interactive-globe';
import { BottomRouteNavigation, RouteSidebarCards } from '../travel-cards/route-stop-panels';
import { travelRoutes, travelStops } from './travel-route-data';

export function TravelRouteVisualization() {
  const [selectedStopId, setSelectedStopId] = useState(travelStops[0]?.id ?? '');
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);

  const selectedStop = useMemo(
    () => travelStops.find((stop) => stop.id === (hoveredStopId ?? selectedStopId)) ?? travelStops[0],
    [hoveredStopId, selectedStopId],
  );

  const activeRouteId = useMemo(() => {
    const currentStopId = hoveredStopId ?? selectedStopId;
    const route = travelRoutes.find((item) => item.startId === currentStopId || item.endId === currentStopId);
    return route?.id ?? null;
  }, [hoveredStopId, selectedStopId]);

  return (
    <motion.section
      className="relative mt-6 mx-auto w-full overflow-hidden rounded-[2.25rem] border border-cyan-400/10 bg-[#050816] text-white shadow-[0_40px_120px_rgba(2,6,23,0.65)] lg:min-h-[56rem]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ type: 'spring', stiffness: 180, damping: 24 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(45,212,191,0.16),transparent_0_20%),radial-gradient(circle_at_75%_14%,rgba(59,130,246,0.12),transparent_0_18%),radial-gradient(circle_at_50%_82%,rgba(34,197,94,0.08),transparent_0_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_34%,rgba(255,255,255,0.03)_68%,transparent)] opacity-80" />

      <div className="relative z-10 border-b border-white/8 px-5 py-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-200">Route intelligence</p>
            <h2 className="max-w-3xl text-[clamp(2.15rem,4.2vw,4.25rem)] font-semibold tracking-[-0.045em] text-white leading-[0.98]">
              Ultra-premium travel route visualization
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base lg:max-w-[42rem]">
              A cinematic route map with an interactive 3D globe, glowing flight paths, and destination cards synchronized across the entire experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              {selectedStop?.name}
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
              {travelStops.length} stops
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:items-start lg:px-6 xl:px-12">
        <div className="relative min-w-0 space-y-5">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-4 xl:p-5">
            <FlightPathOverlay activeRouteId={activeRouteId} />
            <InteractiveGlobe
              selectedStopId={selectedStopId}
              hoveredStopId={hoveredStopId}
              onSelectStop={setSelectedStopId}
              onHoverStop={setHoveredStopId}
            />
          </div>
        </div>

        <div className="hidden min-w-0 rounded-[2rem] border border-white/8 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-5 lg:block lg:min-h-[44rem]">
          <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-200">Route stops</p>
              <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">Vertical route cards</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-slate-200">
              Focused on {selectedStop?.country}
            </span>
          </div>

          <div className="mt-4 max-h-[calc(100vh-16rem)] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin] lg:max-h-[46rem]">
            <RouteSidebarCards
              selectedStopId={selectedStopId}
              hoveredStopId={hoveredStopId}
              onSelectStop={setSelectedStopId}
              onHoverStop={setHoveredStopId}
            />
          </div>
        </div>

        <details className="group min-w-0 rounded-[2rem] border border-white/8 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl lg:hidden" open>
          <summary className="flex list-none cursor-pointer items-center justify-between gap-3 border-b border-white/8 pb-4 [&::-webkit-details-marker]:hidden">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-200">Route stops</p>
              <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">Collapsed route cards</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-slate-200 transition-transform duration-200 group-open:rotate-180">
              Toggle
            </span>
          </summary>

          <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
            <RouteSidebarCards
              selectedStopId={selectedStopId}
              hoveredStopId={hoveredStopId}
              onSelectStop={setSelectedStopId}
              onHoverStop={setHoveredStopId}
            />
          </div>
        </details>
      </div>

      <div className="relative z-10 border-t border-white/8 px-5 py-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-200">Trip timeline</p>
            <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">Bottom route navigation</h3>
          </div>
          <p className="hidden text-sm text-slate-400 md:block">Tap a stop to focus the globe.</p>
        </div>
        <div className="mt-4">
          <BottomRouteNavigation
            selectedStopId={selectedStopId}
            hoveredStopId={hoveredStopId}
            onSelectStop={setSelectedStopId}
            onHoverStop={setHoveredStopId}
          />
        </div>
      </div>
    </motion.section>
  );
}
