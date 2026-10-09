"use client";

import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UnauthorizedView } from "@/components/auth/UnauthorizedView";
import { canAccess } from "@/config/navigation";
import { useActiveUser } from "@/hooks/useActiveUser";
import { BarChart3, Lock } from "lucide-react";
import Link from "next/link";

function ExecutiveContent() {
  const { activeUser, handleUserChange } = useActiveUser();

  const hasAccess = canAccess(activeUser, "executive", "read");

  return (
    <AppShell user={activeUser} onUserChange={handleUserChange}>
      {!hasAccess ? (
        <UnauthorizedView user={activeUser} moduleName="Dashboard Eksekutif" />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/beranda" className="hover:text-brand-600">Beranda</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Dashboard eksekutif</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Dashboard Eksekutif
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ringkasan metrik pendapatan, piutang, dan performa bisnis untuk manajemen (Read-only).
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-50 text-gold-600 border border-gold-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-gold-500" />
              <span>Segera hadir (Fase 6)</span>
            </span>
          </div>

          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            Modul Dashboard Eksekutif dijadwalkan pada roadmap Fase 6 setelah integrasi transaksi operasional stabil.
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function ExecutivePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat modul Eksekutif...</div>}>
      <ExecutiveContent />
    </Suspense>
  );
}
