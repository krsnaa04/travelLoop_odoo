"use client";
import React from "react";
import { ResponsiveContainer, BarChart as ReBar, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
        <p className="text-slate-400 text-xs font-medium mb-1">{label.split(',')[0]}</p>
        <div className="flex items-center gap-2">
          <p className="text-orange-400 text-lg font-bold">
            {payload[0].value.toLocaleString()} 
          </p>
          <span className="text-xs text-slate-500">trips</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function BarChart({ data }: { data: Array<any> }) {
  // Use a gradient of colors for bars
  const colors = ['#F59E0B', '#F97316', '#EA580C', '#C2410C'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBar data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#64748b', fontSize: 11 }} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => value.split(',')[0]}
          dy={10}
        />
        <YAxis 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          tickLine={false} 
          axisLine={false}
        />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomTooltip />} />
        <Bar 
          dataKey="trips" 
          radius={[6, 6, 0, 0]}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </ReBar>
    </ResponsiveContainer>
  );
}
