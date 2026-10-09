"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Users } from "lucide-react";

const HRIS_TABS: SubmoduleTab[] = [
  { id: "absensi_saya", name: "Absensi saya", href: "/hris/absensi-saya", status: "coming_soon" },
  { id: "cuti_saya", name: "Cuti saya", href: "/hris/cuti-saya", status: "coming_soon" },
  { id: "profil_saya", name: "Profil saya", href: "/hris/profil-saya", status: "coming_soon" },
];

export default function ProfilSayaPage() {
  return (
    <SubmodulePageLayout
      moduleId="hris"
      moduleName="HRIS"
      moduleHref="/hris"
      submoduleTitle="Profil Saya"
      submoduleDesc="Informasi data kepegawaian pribadi, jabatan, departemen, dan kontak darurat."
      icon={Users}
      badgeText="Segera Hadir (Fase 6)"
      tabs={HRIS_TABS}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-900 text-white flex items-center justify-center text-xl font-bold">
            CP
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Profil Karyawan Cetrofarm</h2>
            <p className="text-xs text-slate-500">ID Kepegawaian terdaftar pada database sentral Cetrofarm.</p>
          </div>
        </div>

        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
          Modul update data pribadi, upload NPWP, BPJS, dan rekening bank payroll dijadwalkan pada Fase 6.
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
