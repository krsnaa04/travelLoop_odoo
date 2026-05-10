"use client";
import React from "react";
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from "recharts";

const COLORS = ['#8B5CF6','#D946EF','#3B82F6','#22D3EE','#22C55E'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.15)] flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: payload[0].payload.fill }} 
        />
        <div>
          <p className="text-slate-300 text-xs font-medium">{payload[0].name}</p>
          <p className="text-white text-lg font-bold">{payload[0].value}%</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function PieChart({ data }: { data: Array<any> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePie>
        <Pie 
          data={data} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          innerRadius={55} 
          outerRadius={85} 
          paddingAngle={4}
          stroke="none"
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </RePie>
    </ResponsiveContainer>
  );
}
