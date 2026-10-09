"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Users, Clock } from "lucide-react";

const HRIS_TABS: SubmoduleTab[] = [
  { id: "absensi_saya", name: "Absensi saya", href: "/hris/absensi-saya", status: "coming_soon" },
  { id: "cuti_saya", name: "Cuti saya", href: "/hris/cuti-saya", status: "coming_soon" },
  { id: "profil_saya", name: "Profil saya", href: "/hris/profil-saya", status: "coming_soon" },
];

export default function AbsensiSayaPage() {
  return (
    <SubmodulePageLayout
      moduleId="hris"
      moduleName="HRIS"
      moduleHref="/hris"
      submoduleTitle="Absensi Saya"
      submoduleDesc="Pencatatan presensi kerja harian, clock-in/out GPS, dan riwayat lembur karyawan."
      icon={Users}
      badgeText="Segera Hadir (Fase 6)"
      tabs={HRIS_TABS}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Status Kehadiran Hari Ini</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Tercatat Hadir (07:58 WIB)</div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold self-start sm:self-auto">
            Tepat Waktu
          </span>
        </div>

        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
          Sistem absensi mandiri karyawan mobile terintegrasi akan diaktifkan penuh pada Fase 6 HRIS Cetrofarm.
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
