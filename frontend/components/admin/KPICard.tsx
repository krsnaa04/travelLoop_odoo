"use client";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

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
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500;
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (value - startValue) + startValue);
      setDisplayValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
      {displayValue.toLocaleString()}
    </span>
  );
}

export default function KPICard({ id, title, value, delta, series, icon: Icon }: KPIP) {
  const isPositive = delta >= 0;
  
  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-lg overflow-hidden group cursor-pointer"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow highlight on top border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3 w-full">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-sm font-medium text-slate-400">{title}</h3>
            <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-shadow">
              {Icon ? <Icon className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            </div>
          </div>
          
          <div className="flex items-end gap-3">
            <AnimatedNumber value={value} />
          </div>

          <div className="flex items-center justify-between w-full mt-2">
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(delta)}%
            </div>
            <span className="text-xs text-slate-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Sparkline Chart */}
      {series && series.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke={isPositive ? "#22C55E" : "#EF4444"} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
