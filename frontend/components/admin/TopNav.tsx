"use client";
import React, { useState } from "react";
import { Search, Bell, PlusCircle, Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNav() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="w-full h-20 sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10 bg-[#050816]/60 backdrop-blur-xl border-b border-white/5">
      
      {/* Left side: Search & Filters */}
      <div className="flex items-center gap-4 flex-1">
        <motion.div 
          animate={{ width: isSearchFocused ? '320px' : '260px' }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative group flex items-center h-10 rounded-full border transition-colors duration-300 ${isSearchFocused ? 'bg-[#0F172A] border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
          <Search className={`absolute left-3 w-4 h-4 transition-colors ${isSearchFocused ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
          <input
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search users, trips, destinations..."
            className="w-full h-full bg-transparent pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none"
          />
          {/* Keyboard shortcut hint */}
          {!isSearchFocused && (
            <div className="absolute right-3 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-slate-400 border border-white/10 hidden sm:block">
              ⌘K
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-4">
          <button className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/5 border border-white/5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Last 30 Days</span>
            <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
          </button>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <span className="text-xs font-medium text-emerald-400">All Systems Operational</span>
        </div>

        <div className="w-px h-6 bg-white/10 hidden lg:block mx-2"></div>

        {/* Create Button */}
        <button className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-[0_4px_14px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.4)] hover:-translate-y-[1px] transition-all">
          <PlusCircle className="w-4 h-4" />
          <span>New Report</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050816]"></div>
          </button>

          {/* Notification Dropdown (stub) */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h4 className="font-semibold text-sm text-white">Notifications</h4>
                  <span className="text-xs text-cyan-400 cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="p-4 flex flex-col items-center justify-center h-32 text-slate-400 text-sm">
                  <Bell className="w-8 h-8 mb-2 opacity-20" />
                  <p>You're all caught up!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
