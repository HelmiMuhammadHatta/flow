"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Users } from "lucide-react";

const HR_ADMIN_TABS: SubmoduleTab[] = [
  { id: "karyawan", name: "Karyawan", href: "/hris/karyawan", status: "coming_soon" },
  { id: "absensi", name: "Absensi", href: "/hris/absensi", status: "coming_soon" },
  { id: "cuti", name: "Cuti", href: "/hris/cuti", status: "coming_soon" },
];

export default function KaryawanPage() {
  return (
    <SubmodulePageLayout
      moduleId="hris"
      moduleName="HRIS"
      moduleHref="/hris"
      submoduleTitle="Direktori Karyawan"
      submoduleDesc="Database induk seluruh staf, kontrak kerja, status PKWT/PKWTT, dan divisi Cetrofarm."
      icon={Users}
      badgeText="Segera Hadir (Fase 6)"
      tabs={HR_ADMIN_TABS}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
          Modul pengelolaan data master karyawan seluruh divisi akan aktif penuh pada Fase 6 HRIS.
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
