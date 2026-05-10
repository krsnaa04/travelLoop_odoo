'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, LazyMotion, domAnimation, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            style={{ minHeight: '100vh' }}
            initial={{ opacity: 0, y: 14, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.992 }}
            transition={{ type: 'spring', stiffness: 230, damping: 26, mass: 0.85 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </LazyMotion>
    </QueryClientProvider>
  );
}
