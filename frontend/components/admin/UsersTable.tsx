"use client";
import React from "react";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

export default function UsersTable({ users }: { users: Array<any> }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A]/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-10">
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  User <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  Joined <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Trips</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((u, i) => (
              <motion.tr 
                key={u.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group border-b border-white/5 hover:bg-white/5 transition-all duration-300"
              >
                <td className="py-3 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-cyan-500/50 transition-colors" />
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#111827] ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{u.name}</div>
                      <div className="text-xs text-slate-500">@{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 text-slate-300 whitespace-nowrap">{u.email}</td>
                <td className="py-3 px-6 text-slate-400 whitespace-nowrap">{u.joined}</td>
                <td className="py-3 px-6 text-center text-slate-300">
                  <span className="inline-flex items-center justify-center min-w-[2rem] h-6 bg-white/5 rounded-full text-xs font-medium border border-white/5">
                    {u.trips}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-right">
                  <button type="button" aria-label={`Open actions for ${u.name}`} title={`Open actions for ${u.name}`} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
