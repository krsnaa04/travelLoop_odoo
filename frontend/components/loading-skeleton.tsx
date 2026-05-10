'use client';

import { motion } from 'framer-motion';

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`overflow-hidden rounded-2xl bg-white/65 ${className}`}
      initial={{ opacity: 0.55 }}
      animate={{ opacity: [0.55, 0.9, 0.55] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="h-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)] bg-[length:200%_100%] animate-[traveloopShimmer_1.6s_linear_infinite]" />
    </motion.div>
  );
}
