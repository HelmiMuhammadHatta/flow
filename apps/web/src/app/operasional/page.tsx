"use client";

import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UnauthorizedView } from "@/components/auth/UnauthorizedView";
import { canAccess } from "@/config/navigation";
import { useActiveUser } from "@/hooks/useActiveUser";
import { Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function OperasionalContent() {
  const { activeUser, handleUserChange } = useActiveUser();

  const hasAccess = canAccess(activeUser, "ops", "read");

  return (
    <AppShell user={activeUser} onUserChange={handleUserChange}>
      {!hasAccess ? (
        <UnauthorizedView user={activeUser} moduleName="Operasional (CentroOPS)" />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/beranda" className="hover:text-brand-600">Beranda</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Operasional</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Modul Operasional (CentroOPS)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pengelolaan purchase order, penerimaan barang (BTB), faktur, dan rekonsiliasi matching.
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
            {[
              { id: "po", title: "Purchase Order (PO)", desc: "Daftar PO pelanggan dan status pemenuhan.", count: "24 PO Aktif" },
              { id: "btb", title: "Bukti Terima Barang (BTB)", desc: "Penerimaan fisik barang di gudang/distribusi.", count: "18 BTB Tercatat" },
              { id: "invoice", title: "Invoice Penjualan", desc: "Faktur penjualan yang siap direkonsiliasi.", count: "14 Menunggu Matching" },
              { id: "pelunasan", title: "Pelunasan & Alokasi", desc: "Penerimaan pembayaran dan alokasi bank.", count: "8 Batch Alokasi" },
            ].map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-brand-500/40 transition-colors">
                <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand-700">{item.count}</span>
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            Halaman tampilan modul Operasional Centro Platform • Mode Pratinjau
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function OperasionalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat modul Operasional...</div>}>
      <OperasionalContent />
    </Suspense>
  );
}
