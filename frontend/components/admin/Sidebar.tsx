"use client";
import React from "react";
import { Home, Users, MapPin, Plane, Settings, ChartBar, Heart } from "lucide-react";
import { motion } from "framer-motion";

const nav = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "users", label: "Manage Users", icon: Users },
  { key: "trips", label: "Trips", icon: Plane },
  { key: "destinations", label: "Popular Destinations", icon: MapPin },
  { key: "activities", label: "Popular Activities", icon: Heart },
  { key: "analytics", label: "Analytics", icon: ChartBar },
  { key: "revenue", label: "Revenue Insights", icon: ChartBar },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-72 h-screen fixed lg:relative left-0 top-0 bg-[rgba(15,23,42,0.18)] border-r border-[rgba(255,255,255,0.04)] backdrop-blur-md p-3 lg:p-6">
      <div className="flex flex-col h-full">
        <div className="mb-6 hidden lg:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-glow flex items-center justify-center text-white font-bold">TL</div>
          <div>
            <div className="text-sm font-semibold">Traveloop</div>
            <div className="text-xs text-slate-300">Admin</div>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.key}>
                <motion.a whileHover={{ x: 6 }} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r from-white/3 to-transparent transition-colors">
                  <n.icon className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline text-sm text-slate-100">{n.label}</span>
                </motion.a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.03)]">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=admin" alt="admin" className="w-10 h-10 rounded-full ring-1 ring-cyan-400/20 object-cover" />
            <div className="hidden lg:block">
              <div className="text-sm font-semibold">Admin User</div>
              <div className="text-xs text-slate-300">traveloop@team</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
