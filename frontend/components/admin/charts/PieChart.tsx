"use client";
import React from "react";
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from "recharts";

const COLORS = ['#22D3EE','#3B82F6','#22C55E','#F59E0B','#9CA3AF'];

export default function PieChart({ data }: { data: Array<any> }) {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer>
        <RePie>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={38} outerRadius={64} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RePie>
      </ResponsiveContainer>
    </div>
  );
}
