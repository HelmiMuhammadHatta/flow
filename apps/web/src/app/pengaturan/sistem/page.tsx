"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Settings, Save } from "lucide-react";

const SETTINGS_TABS: SubmoduleTab[] = [
  { id: "users", name: "User dan Role", href: "/pengaturan/users", status: "active" },
  { id: "master_data", name: "Master Data", href: "/pengaturan/master-data", status: "active" },
  { id: "sistem", name: "Setting Sistem", href: "/pengaturan/sistem", status: "active" },
];

export default function SistemSettingsPage() {
  return (
    <SubmodulePageLayout
      moduleId="settings"
      moduleName="Pengaturan"
      moduleHref="/pengaturan"
      submoduleTitle="Setting Sistem"
      submoduleDesc="Konfigurasi parameter matching BTB-Invoice, toleransi susut komoditas, dan jadwal tutup periode akuntansi."
      icon={Settings}
      badgeText="Aktif di MVP"
      requiredAction="manage_settings"
      tabs={SETTINGS_TABS}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block">Toleransi Susut Bobot Timbangan (QC)</label>
            <p className="text-[11px] text-slate-500 mt-0.5">Persentase selisih timbangan panen dan penerimaan DC yang diizinkan tanpa revisi PO.</p>
            <div className="mt-2 flex items-center gap-2">
              <input type="number" defaultValue="3" className="w-20 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white" />
              <span className="text-xs text-slate-600">% (Maksimum)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-800 block">Tanggal Cut-off Tutup Buku Periode</label>
            <p className="text-[11px] text-slate-500 mt-0.5">Hari penutupan transaksi akuntansi bulanan (SOP Cetrofarm: Tanggal 25).</p>
            <div className="mt-2 flex items-center gap-2">
              <input type="number" defaultValue="25" className="w-20 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white" />
              <span className="text-xs text-slate-600">Setiap bulan berjalan</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs shadow-2xs">
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
