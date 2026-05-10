'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../lib/auth-store';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/trips', label: 'My Trips' },
  { href: '/trips/new', label: 'Create Trip' },
  { href: '/cities', label: 'City Search' },
  { href: '/activities', label: 'Activity Search' },
  { href: '/community', label: 'Community' },
];

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const activeLabel = useMemo(
    () => links.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))?.label ?? 'Dashboard',
    [pathname],
  );

  return (
    <main className="traveloop-page mx-auto w-full max-w-[1600px]">
      <section className="traveloop-shell traveloop-spotlight rounded-[2rem]">
        <div className="traveloop-content p-5 sm:p-6 lg:p-8">
          <header className="flex flex-col gap-5 border-b border-black/5 pb-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-1">
              <div className="flex items-center gap-3">
                <p className="traveloop-kicker">Traveloop</p>
                <span className="hidden rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-500 sm:inline-flex">
                  {activeLabel}
                </span>
              </div>
              <h1 className="traveloop-title mt-2 text-3xl font-semibold sm:text-4xl lg:text-[2.75rem]">{title}</h1>
              {subtitle ? <p className="traveloop-copy mt-3 max-w-xl text-sm sm:text-base lg:text-lg">{subtitle}</p> : null}
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end md:w-auto">
              <span className="traveloop-pill max-w-[240px] truncate">{user?.email}</span>
              <button
                className="traveloop-button-secondary"
                onClick={() => {
                  clearAuth();
                  router.push('/auth/login');
                }}
                type="button"
              >
                Logout
              </button>
              <button
                className="traveloop-button-primary md:hidden"
                onClick={() => setSidebarOpen((current) => !current)}
                type="button"
              >
                Menu
              </button>
            </div>
          </header>

          <div className="mt-5 grid gap-5 md:grid-cols-[240px_1fr] lg:grid-cols-[268px_1fr]">
            <motion.aside
              className="hidden md:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <div className="traveloop-card rounded-[1.75rem] p-4 lg:p-5">
                <p className="traveloop-kicker text-teal-700">Workspace</p>
                <div className="mt-4 flex flex-col gap-2">
                  {links.map((link) => {
                    const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        href={link.href}
                        key={link.href}
                        className={`traveloop-tab justify-start ${active ? 'traveloop-tab-active' : 'traveloop-tab-inactive'}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.aside>

            <div className="min-w-0">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
                {links.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      href={link.href}
                      key={link.href}
                      className={`traveloop-tab whitespace-nowrap ${active ? 'traveloop-tab-active' : 'traveloop-tab-inactive'}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <motion.div className="mt-6 traveloop-fade-up" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
                {children}
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {sidebarOpen ? (
              <motion.div
                className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              >
                <motion.aside
                  className="traveloop-shell absolute left-0 top-0 h-full w-[88vw] max-w-sm rounded-none rounded-r-[1.75rem]"
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -24, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="traveloop-content flex h-full flex-col p-5">
                    <p className="traveloop-kicker">Navigation</p>
                    <div className="mt-4 flex flex-col gap-2">
                      {links.map((link) => {
                        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                          <Link
                            href={link.href}
                            key={link.href}
                            className={`traveloop-tab justify-start ${active ? 'traveloop-tab-active' : 'traveloop-tab-inactive'}`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.aside>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
