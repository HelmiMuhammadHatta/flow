"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Users } from "lucide-react";

const HRIS_TABS: SubmoduleTab[] = [
  { id: "absensi_saya", name: "Absensi saya", href: "/hris/absensi-saya", status: "coming_soon" },
  { id: "cuti_saya", name: "Cuti saya", href: "/hris/cuti-saya", status: "coming_soon" },
  { id: "profil_saya", name: "Profil saya", href: "/hris/profil-saya", status: "coming_soon" },
];

export default function CutiSayaPage() {
  return (
    <SubmodulePageLayout
      moduleId="hris"
      moduleName="HRIS"
      moduleHref="/hris"
      submoduleTitle="Cuti Saya"
      submoduleDesc="Pengajuan permohonan cuti tahunan, sisa saldo hak cuti, dan persetujuan atasan."
      icon={Users}
      badgeText="Segera Hadir (Fase 6)"
      tabs={HRIS_TABS}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Hak Cuti Tahunan</span>
            <div className="text-xl font-bold text-slate-900 mt-1">12 Hari</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Cuti Digunakan</span>
            <div className="text-xl font-bold text-amber-700 mt-1">3 Hari</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Sisa Kuota Cuti</span>
            <div className="text-xl font-bold text-emerald-700 mt-1">9 Hari</div>
          </div>
        </div>

        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
          Form pengajuan cuti mandiri akan terhubung otomatis dengan alur persetujuan email atasan pada Fase 6.
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
