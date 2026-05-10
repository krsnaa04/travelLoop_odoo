"use client";
import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import TopNav from "../../components/admin/TopNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <TopNav />
          <main className="p-6 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
