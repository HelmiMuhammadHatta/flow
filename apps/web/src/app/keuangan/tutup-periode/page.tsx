"use client";

import React, { Suspense, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UnauthorizedView } from "@/components/auth/UnauthorizedView";
import { canAccess } from "@/config/navigation";
import { useActiveUser } from "@/hooks/useActiveUser";
import {
  CreditCard,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileCheck,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

function TutupPeriodeContent() {
  const { activeUser, handleUserChange } = useActiveUser();
  const [isClosing, setIsClosing] = useState(false);
  const [closedSuccess, setClosedSuccess] = useState(false);

  // Guard rute spesifik aksi: Tutup Periode hanya untuk Finance Corp & Super Admin
  const hasAccess = canAccess(activeUser, "finance", "close_period");

  if (!hasAccess) {
    return (
      <AppShell user={activeUser} onUserChange={handleUserChange}>
        <UnauthorizedView
          user={activeUser}
          moduleName="Aksi Tutup Periode Akuntansi (Khusus Finance Corp & Super Admin)"
        />
      </AppShell>
    );
  }

  const handleExecuteClosing = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setClosedSuccess(true);
    }, 1200);
  };

  return (
    <AppShell user={activeUser} onUserChange={handleUserChange}>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/beranda" className="hover:text-brand-600">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/keuangan" className="hover:text-brand-600">
            Keuangan
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Tutup Periode</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Tutup Periode Akuntansi
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Khusus Finance Corp & Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Proses cut-off penutupan buku transaksi bulanan per tanggal 25 (Periode 2026-10).
              </p>
            </div>
          </div>
        </div>

        {/* Status Periode Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Periode Berjalan</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">2026-10</div>
            <div className="text-xs text-slate-500 mt-1">26 Sep 2026 – 25 Okt 2026</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Invoice Terverifikasi</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">14 / 14 Invoice</div>
            <div className="text-xs text-emerald-700 mt-1 font-medium">Rekonsiliasi 100% Selesai</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>Total Nilai Buku</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">Rp 482.500.000</div>
            <div className="text-xs text-slate-500 mt-1">Skala Nasional (Seluruh Region)</div>
          </div>
        </div>

        {/* Warning Checklist & Confirmation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Aturan Bisnis Penutupan Periode (PRD 4.5):</span>
              Setelah periode akuntansi ditutup, transaksi di periode tersebut dikunci (tidak dapat ditambah, diubah, atau dihapus). Koreksi transaksi masa lalu wajib melalui mekanisme jurnal penyesuaian di periode berjalan.
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Daftar Pemeriksaan Pra-Penutupan:</h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Seluruh penerimaan barang (BTB) telah dicocokkan dengan PO dan faktur fisik.</span>
              </label>
              <label className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Saldo kas & bank seluruh rekening telah terekonsiliasi dengan rekening koran bank.</span>
              </label>
              <label className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Data piutang seluruh region telah dikonfirmasi oleh Finance FA dan Corp.</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <span>Otorisasi pengguna: <strong>{activeUser.name}</strong> ({activeUser.id})</span>
            </div>

            {closedSuccess ? (
              <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Periode 2026-10 Berhasil Ditutup</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleExecuteClosing}
                disabled={isClosing}
                className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isClosing ? "Memproses Penutupan..." : "Konfirmasi Tutup Periode 2026-10"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function TutupPeriodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
          Memuat halaman Tutup Periode...
        </div>
      }
    >
      <TutupPeriodeContent />
    </Suspense>
  );
}
