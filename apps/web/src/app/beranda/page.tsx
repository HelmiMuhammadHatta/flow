"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SummaryStrip } from "@/components/beranda/SummaryStrip";
import { ModuleCard } from "@/components/beranda/ModuleCard";
import { getNavigationForUser } from "@/config/navigation";
import { MOCK_USERS, getInitialUser, getRoleBadgeLabel, saveActiveUser } from "@/lib/auth-mock";
import type { MockUser } from "@/types/auth";
import { ShieldCheck } from "lucide-react";

function BerandaContent() {
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role");

  // Cari persona dev dari query string jika ada (?role=finance_corp, ?role=manager, dll)
  const roleFromQuery = useMemo(() => {
    if (!queryRole) return null;
    const lower = queryRole.toLowerCase();
    const found = MOCK_USERS.find(
      (u) =>
        u.devPersonaKey === lower ||
        u.role === lower ||
        (lower === "direksi" && u.role === "director") ||
        (lower === "karyawan" && u.role === "employee") ||
        (lower === "manajer" && u.role === "manager")
    );
    return found ?? null;
  }, [queryRole]);

  const [currentUser, setCurrentUser] = useState<MockUser>(() => roleFromQuery ?? getInitialUser());

  const activeUser = roleFromQuery ?? currentUser;

  const handleUserChange = (newUser: MockUser) => {
    saveActiveUser(newUser);
    setCurrentUser(newUser);
  };

  const allowedModules = getNavigationForUser(activeUser);

  return (
    <AppShell user={activeUser} onUserChange={handleUserChange}>
      <div className="space-y-6">
        {/* Sapaan Pengguna & Banner Header Ringkas */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {getRoleBadgeLabel(activeUser.role, activeUser.scope, activeUser.devPersonaKey)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Selamat datang kembali, {activeUser.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Satu pintu untuk operasional, keuangan, dan HR Cetrofarm.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Sesi terautentikasi: <strong className="text-slate-800">{activeUser.id}</strong></span>
            </div>
          </div>
        </div>

        {/* Strip Ringkasan Operasional Dinamis Sesuai Role & Scope (Poin 4) */}
        <SummaryStrip user={activeUser} />

        {/* Grid Modul Berdasarkan Hak Akses Role */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Daftar Modul Anda
              </h2>
              <p className="text-xs text-slate-500">
                Menampilkan modul yang diizinkan untuk {getRoleBadgeLabel(activeUser.role, activeUser.scope, activeUser.devPersonaKey)}.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
              {allowedModules.length} modul berlisensi
            </span>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allowedModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function BerandaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
          Memuat portal Centro...
        </div>
      }
    >
      <BerandaContent />
    </Suspense>
  );
}
