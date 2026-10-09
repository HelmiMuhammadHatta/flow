"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { BarChart3 } from "lucide-react";

const EXEC_TABS: SubmoduleTab[] = [
  { id: "exec_summary", name: "Ringkasan Eksekutif", href: "/executive/ringkasan", status: "coming_soon" },
];

export default function RingkasanEksekutifPage() {
  return (
    <SubmodulePageLayout
      moduleId="executive"
      moduleName="Dashboard Eksekutif"
      moduleHref="/executive"
      submoduleTitle="Ringkasan Eksekutif"
      submoduleDesc="Indikator performa kunci bisnis (KPI), perputaran piutang, dan tren pendapatan per wilayah (Read-only)."
      icon={BarChart3}
      badgeText="Segera Hadir (Fase 6)"
      tabs={EXEC_TABS}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Omzet Berjalan Bulan Ini</span>
            <div className="text-xl font-bold text-slate-900 mt-1">Rp 1.482.000.000</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Piutang Belum Lunas</span>
            <div className="text-xl font-bold text-brand-700 mt-1">Rp 482.500.000</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Volume Distribusi Sayur</span>
            <div className="text-xl font-bold text-emerald-700 mt-1">48.200 kg</div>
          </div>
        </div>

        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
          Grafik analitik interaktif dan laporan per region akan dihubungkan secara real-time pada Fase 6.
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
