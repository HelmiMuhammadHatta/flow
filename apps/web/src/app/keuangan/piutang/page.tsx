"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { CreditCard, Search, Filter, Download, ArrowUpRight } from "lucide-react";

const FIN_TABS: SubmoduleTab[] = [
  { id: "piutang", name: "Piutang", href: "/keuangan/piutang", status: "active" },
  { id: "hutang", name: "Hutang", href: "/keuangan/hutang", status: "coming_soon" },
  { id: "kas_bank", name: "Kas dan Bank", href: "/keuangan/kas-bank", status: "active" },
  { id: "tutup_periode", name: "Tutup Periode", href: "/keuangan/tutup-periode", status: "active" },
];

const MOCK_PIUTANG_DATA = [
  { id: "CUST-001", customer: "PT Superindo Mitra Abadi", current: "Rp 120.000.000", d30: "Rp 36.000.000", d60: "Rp 0", total: "Rp 156.000.000", risk: "Lancar", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "CUST-002", customer: "CV Segar Tani Nusantara", current: "Rp 45.000.000", d30: "Rp 15.300.000", d60: "Rp 8.200.000", total: "Rp 68.500.000", risk: "Perhatian (30+ Hari)", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "CUST-003", customer: "Hypermart Cab. Semarang", current: "Rp 88.000.000", d30: "Rp 27.500.000", d60: "Rp 0", total: "Rp 115.500.000", risk: "Lancar", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "CUST-004", customer: "PT Agrimas Selaras", current: "Rp 35.000.000", d30: "Rp 0", d60: "Rp 0", total: "Rp 35.000.000", risk: "Lancar", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "CUST-005", customer: "Hero Supermarket Jakarta", current: "Rp 75.000.000", d30: "Rp 32.500.000", d60: "Rp 0", total: "Rp 107.500.000", risk: "Lancar", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export default function PiutangPage() {
  return (
    <SubmodulePageLayout
      moduleId="finance"
      moduleName="Keuangan"
      moduleHref="/keuangan"
      submoduleTitle="Piutang Usaha"
      submoduleDesc="Outstanding piutang berjalan per pelanggan, analisis umur piutang (Aging AR), dan jadwal jatuh tempo tagihan."
      icon={CreditCard}
      badgeText="Fase 1 MVP Aktif"
      tabs={FIN_TABS}
    >
      <div className="space-y-4">
        {/* Ringkasan Aging AR Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Piutang Berjalan</span>
            <div className="text-xl font-bold text-slate-900 mt-1">Rp 482.500.000</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">5 Pelanggan Utama</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase">Lancar (0 - 30 Hari)</span>
            <div className="text-xl font-bold text-emerald-700 mt-1">Rp 363.000.000</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">75.2% Portofolio</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-amber-600 uppercase">Jatuh Tempo (31 - 60 Hari)</span>
            <div className="text-xl font-bold text-amber-700 mt-1">Rp 111.300.000</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Perlu Follow-up</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-rose-600 uppercase">Kritis (&gt; 60 Hari)</span>
            <div className="text-xl font-bold text-rose-700 mt-1">Rp 8.200.000</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">1 Pelanggan</span>
          </div>
        </div>

        {/* Toolbar & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama pelanggan atau kode..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Kategori Umur</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor Aging Report</span>
            </button>
          </div>
        </div>

        {/* Tabel Aging AR */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Nama Pelanggan</th>
                  <th className="py-3 px-4 text-right">Lancar</th>
                  <th className="py-3 px-4 text-right">31-60 Hari</th>
                  <th className="py-3 px-4 text-right">&gt;60 Hari</th>
                  <th className="py-3 px-4 text-right">Total Saldo</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {MOCK_PIUTANG_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.customer}</td>
                    <td className="py-3 px-4 text-right">{row.current}</td>
                    <td className="py-3 px-4 text-right text-amber-700 font-medium">{row.d30}</td>
                    <td className="py-3 px-4 text-right text-rose-700 font-medium">{row.d60}</td>
                    <td className="py-3 px-4 font-bold text-right text-slate-900">{row.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${row.badgeColor}`}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-brand-600 hover:text-brand-800 font-semibold text-xs inline-flex items-center gap-1">
                        <span>Buku Besar</span>
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
