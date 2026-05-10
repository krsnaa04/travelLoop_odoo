'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function AnimatedModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="traveloop-shell w-full max-w-5xl overflow-hidden rounded-[1.75rem]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="traveloop-content flex max-h-[calc(100vh-2rem)] flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <p className="traveloop-kicker">Modal</p>
                  <h2 className="traveloop-title mt-2 text-2xl font-semibold sm:text-[2rem]">{title}</h2>
                </div>
                <button className="traveloop-pill shrink-0" onClick={onClose} type="button">
                  Close
                </button>
              </div>
              <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
