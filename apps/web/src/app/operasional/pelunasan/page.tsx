"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Truck, Plus, Search, Filter, Download, ArrowUpRight } from "lucide-react";

const OPS_TABS: SubmoduleTab[] = [
  { id: "po", name: "PO (Pesanan)", href: "/operasional/po", status: "active" },
  { id: "btb", name: "BTB (Penerimaan)", href: "/operasional/btb", status: "active" },
  { id: "invoice", name: "Invoice", href: "/operasional/invoice", status: "active" },
  { id: "pelunasan", name: "Pelunasan", href: "/operasional/pelunasan", status: "active" },
];

const MOCK_PELUNASAN_DATA = [
  { id: "PLN-2026-0199", invId: "INV-2026-0309", customer: "PT Agrimas Selaras", bank: "BCA Giro 142-889-100", date: "08 Okt 2026", amount: "Rp 16.800.000", status: "Lunas Sepenuhnya", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "PLN-2026-0198", invId: "INV-2026-0305", customer: "Hero Supermarket Jakarta", bank: "Mandiri Giro 137-00-112", date: "07 Okt 2026", amount: "Rp 25.000.000", status: "Lunas Sepenuhnya", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "PLN-2026-0197", invId: "INV-2026-0300", customer: "PT Lotte Shopping ID", bank: "BCA Giro 142-889-100", date: "06 Okt 2026", amount: "Rp 18.500.000", status: "Sebagian (Down Payment)", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function PelunasanPage() {
  return (
    <SubmodulePageLayout
      moduleId="ops"
      moduleName="Operasional"
      moduleHref="/operasional"
      submoduleTitle="Pelunasan & Alokasi"
      submoduleDesc="Alokasi pembayaran penerimaan bank terhadap faktur komersial, rekonsiliasi transfer, dan bukti setor."
      icon={Truck}
      badgeText="Fase 1 MVP Aktif"
      tabs={OPS_TABS}
    >
      <div className="space-y-4">
        {/* Toolbar & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nomor bukti pelunasan atau invoice..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Rekening Bank</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor</span>
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-2xs">
              <Plus className="w-4 h-4" />
              <span>Input Alokasi</span>
            </button>
          </div>
        </div>

        {/* Tabel Data Pelunasan */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">No. Pelunasan</th>
                  <th className="py-3 px-4">Referensi Invoice</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Rekening Tujuan</th>
                  <th className="py-3 px-4">Tgl Penerimaan</th>
                  <th className="py-3 px-4 text-right">Nilai Alokasi</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {MOCK_PELUNASAN_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="py-3 px-4 font-mono text-brand-600 font-medium">{row.invId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.customer}</td>
                    <td className="py-3 px-4 text-slate-600">{row.bank}</td>
                    <td className="py-3 px-4 text-slate-500">{row.date}</td>
                    <td className="py-3 px-4 font-semibold text-right text-slate-900">{row.amount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${row.badgeColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-brand-600 hover:text-brand-800 font-semibold text-xs inline-flex items-center gap-1">
                        <span>Detail</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
