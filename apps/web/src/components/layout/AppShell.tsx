"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { MockUser } from "@/types/auth";
import { RoleSwitcherDev } from "@/components/dev/RoleSwitcherDev";

interface AppShellProps {
  user: MockUser;
  onUserChange?: (user: MockUser) => void;
  children: React.ReactNode;
}

export function AppShell({ user, onUserChange, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Header user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Role Switcher Dev Tool */}
      <RoleSwitcherDev currentUser={user} onUserChange={onUserChange} />
    </div>
  );
}
