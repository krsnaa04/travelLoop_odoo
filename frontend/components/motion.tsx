'use client';

import { motion } from 'framer-motion';

export const pageTransition = {
  initial: { opacity: 0, y: 16, scale: 0.992 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.992 },
  transition: { type: 'spring', stiffness: 230, damping: 26, mass: 0.85 },
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const lift = {
  y: -4,
  scale: 1.01,
  transition: { type: 'spring', stiffness: 280, damping: 22 },
};

export const itemMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 240, damping: 24 },
};

export function MotionSection(props: React.ComponentProps<typeof motion.section>) {
  return <motion.section {...props} />;
}

export function MotionArticle(props: React.ComponentProps<typeof motion.article>) {
  return <motion.article {...props} />;
}

export function MotionDiv(props: React.ComponentProps<typeof motion.div>) {
  return <motion.div {...props} />;
}
