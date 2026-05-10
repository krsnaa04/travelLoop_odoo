"use client";
import React from "react";
import KPICard from "../../components/admin/KPICard";
import LineChart from "../../components/admin/charts/LineChart";
import BarChart from "../../components/admin/charts/BarChart";
import PieChart from "../../components/admin/charts/PieChart";
import UsersTable from "../../components/admin/UsersTable";
import { metrics, users, destinations, activities } from "../../lib/adminData";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function AdminPage() {
  return (
    <motion.div 
      className="max-w-[1600px] mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with Traveloop today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-[#0F172A] border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-colors">
            Export Report
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {metrics.map((m) => (
          <KPICard key={m.id} {...m} />
        ))}
        {/* Added 4th Mock Card for Layout Balance */}
        <KPICard 
          id="revenue"
          title="Monthly Revenue"
          value={84200}
          delta={12.5}
          series={metrics[0].series.map(s => ({x: s.x, y: s.y * 1.5}))} 
        />
      </motion.section>

      {/* Main Charts Area */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="traveloop-card p-6 h-[420px] flex flex-col relative overflow-hidden group">
            {/* Soft background glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-semibold text-white">Platform Growth</h3>
                <p className="text-sm text-slate-400">Active users and engagement over time</p>
              </div>
              <select className="bg-[#0F172A] border border-white/10 text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-cyan-500/50">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex-1 w-full min-h-0 relative z-10">
              <LineChart data={metrics[0].series} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="traveloop-card p-6 flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-lg font-semibold text-white mb-1 relative z-10">Popular Destinations</h3>
            <p className="text-sm text-slate-400 mb-6 relative z-10">Top booked locations</p>
            <div className="flex-1 w-full min-h-0 relative z-10">
              <BarChart data={destinations} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Grid: Tables & Secondary Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="traveloop-card p-0 flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Recent Users</h3>
                <p className="text-sm text-slate-400">Manage your latest signups</p>
              </div>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="p-0">
              <UsersTable users={users.slice(0, 6)} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="traveloop-card p-6 relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
             <h3 className="text-lg font-semibold text-white mb-1 relative z-10">Travel Categories</h3>
             <p className="text-sm text-slate-400 mb-6 relative z-10">Breakdown by activity type</p>
             <div className="h-[250px] w-full relative z-10">
                <PieChart data={activities} />
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
