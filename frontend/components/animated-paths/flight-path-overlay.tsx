'use client';

import { motion } from 'framer-motion';
import { travelRoutes } from '../route-map/travel-route-data';

function buildPath(routeIndex: number) {
  const startY = 180 + routeIndex * 92;
  const endY = startY - 40 + routeIndex * 12;
  const controlY = 70 + routeIndex * 18;
  const startX = 190;
  const endX = 1050;
  const controlX = 520 + routeIndex * 42;
  return `M ${startX} ${startY} C ${controlX} ${controlY}, ${controlX + 120} ${controlY + 20}, ${endX} ${endY}`;
}

export function FlightPathOverlay({ activeRouteId }: { activeRouteId: string | null }) {
  return (
    <svg
      viewBox="0 0 1200 760"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        {travelRoutes.map((route, index) => (
          <linearGradient key={route.id} id={`flight-gradient-${route.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={route.gradient[0]} />
            <stop offset="55%" stopColor={route.gradient[1]} />
            <stop offset="100%" stopColor={route.gradient[2]} />
          </linearGradient>
        ))}
      </defs>

      {travelRoutes.map((route, index) => {
        const isActive = !activeRouteId || activeRouteId === route.id || activeRouteId === route.startId || activeRouteId === route.endId;
        const path = buildPath(index);
        return (
          <g key={route.id} opacity={isActive ? 0.95 : 0.25}>
            <motion.path
              d={path}
              fill="none"
              stroke={`url(#flight-gradient-${route.id})`}
              strokeWidth={isActive ? 4.5 : 3.5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.15 * index }}
              style={{ filter: 'drop-shadow(0 0 10px rgba(103,232,249,0.55))' }}
              strokeDasharray="14 12"
            />
            <motion.path
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeDasharray="1.5 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: 0.15 * index }}
              opacity={isActive ? 0.95 : 0.25}
            />
          </g>
        );
      })}
    </svg>
  );
}
