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
      className="traveloop-card overflow-hidden rounded-[1.75rem] border border-white/8 bg-slate-900 p-6 sm:p-8"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <p className="traveloop-kicker text-cyan-400">Empty State</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="traveloop-copy max-w-xl text-slate-300 text-sm sm:text-base">{description}</p>
          <Link className="traveloop-button-primary inline-flex w-fit mt-4" href={ctaHref}>
            {ctaLabel}
          </Link>
        </div>
        <motion.div
          className="relative h-64 w-full overflow-hidden rounded-[1.5rem] shadow-2xl"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80" alt="Beautiful travel destination" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-60"></div>
        </motion.div>
      </div>
    </motion.section>
  );
}