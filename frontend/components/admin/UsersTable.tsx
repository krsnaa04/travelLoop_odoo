"use client";
import React from "react";
import { MoreHorizontal } from "lucide-react";

export default function UsersTable({ users }: { users: Array<any> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs text-slate-300 border-b border-[rgba(255,255,255,0.03)]">
            <th className="py-2">User</th>
            <th className="py-2">Email</th>
            <th className="py-2">Joined</th>
            <th className="py-2">Trips</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <td className="py-3 flex items-center gap-3">
                <img src={u.avatar} alt="a" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-slate-400">{u.username}</div>
                </div>
              </td>
              <td className="py-3">{u.email}</td>
              <td className="py-3">{u.joined}</td>
              <td className="py-3">{u.trips}</td>
              <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${u.status === 'active' ? 'bg-emerald-600/20 text-emerald-300' : 'bg-orange-600/20 text-orange-300'}`}>{u.status}</span></td>
              <td className="py-3">
                <button type="button" aria-label={`Open actions for ${u.name}`} title={`Open actions for ${u.name}`} className="p-2 rounded hover:bg-[rgba(255,255,255,0.02)]">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
