"use client";
import React, { useState } from "react";
import { Home, Users, MapPin, Plane, Settings, ChartBar, Heart, ChevronLeft, ChevronRight, Bell, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navGroups = [
  {
    title: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", icon: Home },
      { key: "analytics", label: "Analytics", icon: ChartBar },
    ]
  },
  {
    title: "Management",
    items: [
      { key: "users", label: "Users & Roles", icon: Users },
      { key: "trips", label: "Active Trips", icon: Plane },
      { key: "destinations", label: "Destinations", icon: MapPin },
      { key: "activities", label: "Activities", icon: Heart },
    ]
  },
  {
    title: "System",
    items: [
      { key: "security", label: "Security", icon: Shield },
      { key: "settings", label: "Settings", icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");

  return (
    <motion.aside 
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 left-0 bg-[#0F172A]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 overflow-hidden"
    >
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/10 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="p-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="font-bold text-white tracking-tighter">TL</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <div className="text-sm font-bold text-white tracking-wide">TRAVELOOP</div>
                <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold">Admin Workspace</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-8 right-[-12px] w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-2 z-10 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                {group.title}
              </motion.div>
            )}
            <ul className="space-y-1">
              {group.items.map((n) => {
                const isActive = active === n.key;
                return (
                  <li key={n.key}>
                    <button 
                      onClick={() => setActive(n.key)}
                      className={`w-full group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-sidebar-glow"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/5 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                      )}
                      
                      <div className="relative z-10 flex items-center gap-3">
                        <n.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-cyan-300'}`} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span 
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className={`text-sm whitespace-nowrap overflow-hidden ${isActive ? 'font-semibold' : 'font-medium'}`}
                            >
                              {n.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Admin Profile Footer */}
      <div className="p-4 z-10 border-t border-white/5 bg-[#0F172A]/50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors`}>
          <div className="relative">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-10 h-10 rounded-full border-2 border-cyan-500/30 object-cover" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0F172A] rounded-full"></div>
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">Alice Director</div>
              <div className="text-xs text-slate-400 truncate">System Admin</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
