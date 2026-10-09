"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Settings } from "lucide-react";

const SETTINGS_TABS: SubmoduleTab[] = [
  { id: "users", name: "User dan Role", href: "/pengaturan/users", status: "active" },
  { id: "master_data", name: "Master Data", href: "/pengaturan/master-data", status: "active" },
  { id: "sistem", name: "Setting Sistem", href: "/pengaturan/sistem", status: "active" },
];

const MOCK_MASTER = [
  { category: "Pelanggan Modern Trade", count: "14 Perusahaan", desc: "Supermarket, hypermarket, dan horeca ritel", updated: "08 Okt 2026" },
  { category: "Komoditas Pertanian", count: "32 Jenis Sayur", desc: "Brokoli, wortel, kubis, kentang, tomat beef, dll", updated: "05 Okt 2026" },
  { category: "Distribution Center (DC)", count: "4 Lokasi DC", desc: "Semarang (Bandungan), Ungaran, Magelang, Jakarta", updated: "01 Okt 2026" },
  { category: "Petani Mitra & Kelompok Tani", count: "58 Kelompok", desc: "Kemitraan pasok sayuran dataran tinggi", updated: "28 Sep 2026" },
];

export default function MasterDataPage() {
  return (
    <SubmodulePageLayout
      moduleId="settings"
      moduleName="Pengaturan"
      moduleHref="/pengaturan"
      submoduleTitle="Master Data"
      submoduleDesc="Katalog master komoditas sayuran, daftar customer modern trade, gudang DC, dan kelompok tani mitra."
      icon={Settings}
      badgeText="Aktif di MVP"
      requiredAction="manage_settings"
      tabs={SETTINGS_TABS}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_MASTER.map((m) => (
            <div key={m.category} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-brand-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{m.category}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">{m.count}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">{m.desc}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Update: {m.updated}</span>
                <button className="text-brand-600 hover:text-brand-800 font-semibold">Kelola Data →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
