'use client';

import { motion } from 'framer-motion';
import { SkeletonBlock } from '../components/loading-skeleton';

export default function Loading() {
  return (
    <main className="traveloop-page mx-auto flex w-full max-w-6xl items-center justify-center">
      <motion.section
        className="traveloop-shell w-full rounded-[2rem]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        <div className="traveloop-content p-5 sm:p-6 lg:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-4">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-10 w-3/4" />
              <SkeletonBlock className="h-5 w-5/6" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-28 rounded-[1.25rem]" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <SkeletonBlock className="h-48 rounded-[1.75rem]" />
              <SkeletonBlock className="h-36 rounded-[1.75rem]" />
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
