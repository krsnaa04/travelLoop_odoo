"use client";
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { TrendingUp, Users as UsersIcon } from "lucide-react";

type KPIP = {
  id: string;
  title: string;
  value: number;
  delta: number;
  series?: Array<{ x: string; y: number }>;
  icon?: React.ElementType;
};

function AnimatedNumber({ value }: { value: number }) {
  const controls = useAnimation();
  React.useEffect(() => {
    controls.start({ count: value, transition: { duration: 1.1, ease: "easeOut" } });
  }, [value, controls]);
  return (
    <motion.span
      animate={{}}
      initial={{}}
      className="text-2xl font-bold"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

export default function KPICard({ id, title, value, delta, series, icon: Icon }: KPIP) {
  return (
    <motion.div whileHover={{ y: -4 }} className="traveloop-card p-4 flex items-center justify-between gap-4">
      <div>
        <div className="text-sm text-slate-300">{title}</div>
        <div className="flex items-center gap-3">
          <AnimatedNumber value={value} />
          <div className={`text-sm ${delta >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{delta}%</div>
        </div>
        <div className="text-xs text-slate-400">Last 30 days</div>
      </div>
      <div className="w-14 h-14 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
        {Icon ? <Icon className="w-6 h-6 text-cyan-300" /> : <TrendingUp className="w-6 h-6 text-cyan-300" />}
      </div>
    </motion.div>
  );
}
