"use client";
import React from "react";
import { ResponsiveContainer, BarChart as ReBar, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function BarChart({ data }: { data: Array<any> }) {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer>
        <ReBar data={data} margin={{ top: 8, right: 12, left: 0, bottom: 6 }}>
          <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
          <YAxis tick={{ fill: '#94a3b8' }} />
          <Tooltip />
          <Bar dataKey="trips" fill="#3B82F6" radius={[6,6,0,0]} />
        </ReBar>
      </ResponsiveContainer>
    </div>
  );
}
