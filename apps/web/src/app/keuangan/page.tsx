"use client";

import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UnauthorizedView } from "@/components/auth/UnauthorizedView";
import { canAccess } from "@/config/navigation";
import { useActiveUser } from "@/hooks/useActiveUser";
import { CreditCard, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

function KeuanganContent() {
  const { activeUser, handleUserChange } = useActiveUser();

  const hasAccess = canAccess(activeUser, "finance", "read");
  const canClosePeriod = canAccess(activeUser, "finance", "close_period");

  return (
    <AppShell user={activeUser} onUserChange={handleUserChange}>
      {!hasAccess ? (
        <UnauthorizedView user={activeUser} moduleName="Keuangan" />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/beranda" className="hover:text-brand-600">Beranda</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Keuangan</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Modul Keuangan
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoring piutang, hutang operasional, arus kas bank, dan penutupan periode.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Fase 1 MVP Aktif
              </span>
            </div>
          </div>

          {/* Quick Sub-menu Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-brand-500/40 transition-colors">
              <span className="text-xs font-bold text-slate-900 block">Piutang Pelanggan</span>
              <p className="text-[11px] text-slate-500 mt-1">Outstanding piutang berjalan per pelanggan.</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700">Rp 482.500.000</span>
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 block">Hutang Vendor</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-50 text-gold-600 font-medium border border-gold-200">Segera hadir</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Kewajiban vendor bills (Fase 3 Procurement).</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Roadmap Fase 3</span>
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-brand-500/40 transition-colors">
              <span className="text-xs font-bold text-slate-900 block">Kas dan Bank</span>
              <p className="text-[11px] text-slate-500 mt-1">Mutasi rekening operasional dan bukti transfer.</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700">3 Rekening Aktif</span>
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
              </div>
            </div>

            {canClosePeriod && (
              <div className="bg-white border border-brand-200 rounded-xl p-4 shadow-2xs hover:border-brand-500 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 block">Tutup Periode</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">Khusus Corp</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Closing akuntansi tanggal 25 (2026-10).</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700">Periode 2026-10</span>
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            Halaman tampilan modul Keuangan Centro Platform • Mode Pratinjau
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function KeuanganPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat modul Keuangan...</div>}>
      <KeuanganContent />
    </Suspense>
  );
}
