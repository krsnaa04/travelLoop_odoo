'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <motion.section
      className="traveloop-card overflow-hidden rounded-[1.75rem] border border-black/8 bg-white p-6 sm:p-8"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="traveloop-kicker text-teal-700">Fresh account</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
          <p className="traveloop-copy max-w-xl text-sm sm:text-base">{description}</p>
          <Link className="traveloop-button-primary inline-flex w-fit" href={ctaHref}>
            {ctaLabel}
          </Link>
        </div>
        <motion.div
          className="relative flex min-h-[220px] items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),rgba(255,255,255,0.02)_55%),linear-gradient(180deg,rgba(15,23,42,0.03),rgba(15,23,42,0.08))] p-6"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-[1.5rem] border border-white/40" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <div className="h-14 w-14 rounded-2xl border-2 border-teal-500/60 border-dashed" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}