"use client";
import React from "react";
import { Search, Bell, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TopNav() {
  return (
    <div className="w-full flex items-center justify-between py-4 px-6 lg:px-10 border-b border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            aria-label="Search metrics, users, destinations"
            placeholder="Search metrics, users, destinations..."
            className="traveloop-input text-sm w-64 pl-10 pr-3 bg-transparent border border-[rgba(255,255,255,0.04)]"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <select aria-label="Filter region" className="traveloop-input text-sm w-40 bg-transparent border-[rgba(255,255,255,0.04)]">
            <option>All Regions</option>
            <option>Americas</option>
            <option>EMEA</option>
          </select>
          <input type="date" aria-label="Filter date" title="Filter date" className="traveloop-input text-sm w-40 bg-transparent border-[rgba(255,255,255,0.04)]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Notifications" title="Notifications" className="p-2 rounded-md hover:bg-slate-900/3">
          <Bell className="w-5 h-5 text-slate-200" />
        </button>
        <button type="button" aria-label="Quick action" title="Quick action" className="traveloop-button-primary">
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold">A</div>
      </div>
    </div>
  );
}
