"use client";
import React from "react";
import KPICard from "../../components/admin/KPICard";
import LineChart from "../../components/admin/charts/LineChart";
import BarChart from "../../components/admin/charts/BarChart";
import PieChart from "../../components/admin/charts/PieChart";
import UsersTable from "../../components/admin/UsersTable";
import { metrics, users, destinations, activities } from "../../lib/adminData";
import { motion } from "framer-motion";

export default function AdminPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {metrics.map((m) => (
          <KPICard key={m.id} {...m} />
        ))}
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="traveloop-card traveloop-gradient-panel p-4">
            <h3 className="text-sm text-cyan-300 mb-2">User Growth</h3>
            <LineChart data={metrics[0].series} />
          </div>
        </div>
        <div>
          <div className="traveloop-card p-4">
            <h3 className="text-sm text-cyan-300 mb-2">Popular Destinations</h3>
            <BarChart data={destinations} />
          </div>
          <div className="mt-4 traveloop-card p-4">
            <h3 className="text-sm text-cyan-300 mb-2">Travel Categories</h3>
            <PieChart data={activities} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="traveloop-card p-4">
            <h3 className="text-sm text-cyan-300 mb-4">Manage Users</h3>
            <UsersTable users={users} />
          </div>
        </div>
        <div>
          <div className="traveloop-card p-4">
            <h3 className="text-sm text-cyan-300 mb-4">Trending Destinations</h3>
            <div className="space-y-3">
              {destinations.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center gap-3">
                  <img src={d.image} alt={d.name} className="w-16 h-12 rounded-lg object-cover border border-[rgba(255,255,255,0.08)]" />
                  <div className="flex-1">
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-xs text-slate-300">{d.trips} trips • {d.growth}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
