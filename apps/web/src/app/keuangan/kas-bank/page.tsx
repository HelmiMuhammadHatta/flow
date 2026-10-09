"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { CreditCard, Search, Filter, Download, Building2 } from "lucide-react";

const FIN_TABS: SubmoduleTab[] = [
  { id: "piutang", name: "Piutang", href: "/keuangan/piutang", status: "active" },
  { id: "hutang", name: "Hutang", href: "/keuangan/hutang", status: "coming_soon" },
  { id: "kas_bank", name: "Kas dan Bank", href: "/keuangan/kas-bank", status: "active" },
  { id: "tutup_periode", name: "Tutup Periode", href: "/keuangan/tutup-periode", status: "active" },
];

const MOCK_ACCOUNTS = [
  { name: "BCA Giro Operasional", number: "142-889-1002", balance: "Rp 328.450.000", type: "Bank Utama (Matching Auto)" },
  { name: "Mandiri Giro Payroll & Tax", number: "137-00-1129-8", balance: "Rp 145.200.000", type: "Bank Operasional" },
  { name: "Kas Kecil DC Semarang", number: "PETTY-SMG-01", balance: "Rp 12.800.000", type: "Petty Cash Kasir" },
  { name: "Kas Kecil Hub Jakarta", number: "PETTY-JKT-02", balance: "Rp 8.500.000", type: "Petty Cash Kasir" },
];

const MOCK_MUTASI = [
  { id: "MUT-8812", date: "08 Okt 2026 14:20", desc: "Penerimaan Pelunasan PT Agrimas Selaras", type: "in", amount: "+ Rp 16.800.000", bank: "BCA Giro", ref: "PLN-2026-0199" },
  { id: "MUT-8811", date: "08 Okt 2026 10:15", desc: "BBM & Tol Armada Distribusi Wilayah Solo", type: "out", amount: "- Rp 1.450.000", bank: "Kas Kecil DC SMG", ref: "VCH-2026-041" },
  { id: "MUT-8810", date: "07 Okt 2026 16:45", desc: "Penerimaan Pelunasan Hero Supermarket", type: "in", amount: "+ Rp 25.000.000", bank: "Mandiri Giro", ref: "PLN-2026-0198" },
  { id: "MUT-8809", date: "07 Okt 2026 09:30", desc: "Biaya Listrik Cold Storage Ungaran", type: "out", amount: "- Rp 8.750.000", bank: "BCA Giro", ref: "VCH-2026-039" },
];

export default function KasBankPage() {
  return (
    <SubmodulePageLayout
      moduleId="finance"
      moduleName="Keuangan"
      moduleHref="/keuangan"
      submoduleTitle="Kas dan Bank"
      submoduleDesc="Daftar rekening bank perusahaan, saldo kas kecil Distribution Center (DC), dan mutasi transaksi harian."
      icon={CreditCard}
      badgeText="Fase 1 MVP Aktif"
      tabs={FIN_TABS}
    >
      <div className="space-y-4">
        {/* Rekening Bank Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_ACCOUNTS.map((acc) => (
            <div key={acc.number} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-brand-700">{acc.type}</span>
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-base font-bold text-slate-900 mt-2">{acc.name}</div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">{acc.number}</div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                {acc.balance}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari deskripsi mutasi atau nomor bukti..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Semua Rekening</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Rekening Koran</span>
            </button>
          </div>
        </div>

        {/* Tabel Mutasi Harian */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">No. Transaksi</th>
                  <th className="py-3 px-4">Tanggal & Jam</th>
                  <th className="py-3 px-4">Rekening</th>
                  <th className="py-3 px-4">Keterangan / Deskripsi</th>
                  <th className="py-3 px-4">No. Ref</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {MOCK_MUTASI.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="py-3 px-4 text-slate-500">{row.date}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{row.bank}</td>
                    <td className="py-3 px-4">{row.desc}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{row.ref}</td>
                    <td className={`py-3 px-4 font-bold text-right ${
                      row.type === "in" ? "text-emerald-700" : "text-slate-900"
                    }`}>
                      {row.amount}
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
