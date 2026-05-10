"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)]">
        <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
        <p className="text-cyan-400 text-lg font-bold">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function LineChart({ data }: { data: Array<{ x: string; y: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="x" 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          tickLine={false} 
          axisLine={false}
          dy={10}
        />
        <YAxis 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area 
          type="monotone" 
          dataKey="y" 
          stroke="#22D3EE" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorUv)" 
          activeDot={{ r: 6, fill: "#0F172A", stroke: "#22D3EE", strokeWidth: 2 }}
          filter="url(#glow)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
