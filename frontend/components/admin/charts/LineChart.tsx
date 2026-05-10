"use client";
import React from "react";
import { ResponsiveContainer, LineChart as ReLine, Line, XAxis, YAxis, Tooltip, Area } from "recharts";

export default function LineChart({ data }: { data: Array<{ x: string; y: number }> }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <ReLine data={data}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.06} />
            </linearGradient>
          </defs>
          <XAxis dataKey="x" tick={{ fill: '#94a3b8' }} />
          <YAxis tick={{ fill: '#94a3b8' }} />
          <Tooltip />
          <Area type="monotone" dataKey="y" stroke="#22D3EE" fill="url(#grad)" />
          <Line type="monotone" dataKey="y" stroke="#22D3EE" strokeWidth={2} dot={false} />
        </ReLine>
      </ResponsiveContainer>
    </div>
  );
}
