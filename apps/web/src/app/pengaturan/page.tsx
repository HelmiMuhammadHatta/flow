"use client";

import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UnauthorizedView } from "@/components/auth/UnauthorizedView";
import { canAccess } from "@/config/navigation";
import { useActiveUser } from "@/hooks/useActiveUser";
import { Settings, CheckCircle2, ShieldCheck, Database, Sliders } from "lucide-react";
import Link from "next/link";

function PengaturanContent() {
  const { activeUser, handleUserChange } = useActiveUser();

  const hasAccess = canAccess(activeUser, "settings", "manage_settings");

  return (
    <AppShell user={activeUser} onUserChange={handleUserChange}>
      {!hasAccess ? (
        <UnauthorizedView user={activeUser} moduleName="Pengaturan" />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/beranda" className="hover:text-brand-600">Beranda</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Pengaturan</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-600">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Modul Pengaturan Sistem
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manajemen pengguna, hak akses role, master data customer, dan parameter sistem.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Aktif di MVP (Admin)
              </span>
            </div>
          </div>

          {/* Quick Sub-menu Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/pengaturan/users"
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-brand-500/60 hover:shadow-xs transition-all block group"
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">User dan Role</span>
              </div>
              <p className="text-[11px] text-slate-500">Pengelolaan kredensial akun, scope wewenang, dan audit login.</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700">8 Pengguna Terdaftar</span>
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
              </div>
            </Link>

            <Link
              href="/pengaturan/master-data"
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-brand-500/60 hover:shadow-xs transition-all block group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Master Data</span>
              </div>
              <p className="text-[11px] text-slate-500">Master customer, pemetaan region, dan divisi organisasi.</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700">Region I & II Siap</span>
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
              </div>
            </Link>

            <Link
              href="/pengaturan/sistem"
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-brand-500/60 hover:shadow-xs transition-all block group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Setting Sistem</span>
              </div>
              <p className="text-[11px] text-slate-500">Toleransi matching (Rp 1.000) dan grace days overdue.</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700">Default Aktif</span>
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
              </div>
            </Link>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            Halaman tampilan modul Pengaturan Centro Platform • Terbuka untuk Admin & Super Admin
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function PengaturanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat modul Pengaturan...</div>}>
      <PengaturanContent />
    </Suspense>
  );
}
