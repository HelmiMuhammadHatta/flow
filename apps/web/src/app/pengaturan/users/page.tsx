"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { Settings, Plus, Search, Filter } from "lucide-react";
import { MOCK_USERS, getRoleBadgeLabel } from "@/lib/auth-mock";

const SETTINGS_TABS: SubmoduleTab[] = [
  { id: "users", name: "User dan Role", href: "/pengaturan/users", status: "active" },
  { id: "master_data", name: "Master Data", href: "/pengaturan/master-data", status: "active" },
  { id: "sistem", name: "Setting Sistem", href: "/pengaturan/sistem", status: "active" },
];

export default function UsersSettingsPage() {
  return (
    <SubmodulePageLayout
      moduleId="settings"
      moduleName="Pengaturan"
      moduleHref="/pengaturan"
      submoduleTitle="User dan Role"
      submoduleDesc="Manajemen akun pengguna, konfigurasi role RBAC, penugasan cakupan wilayah, dan hak akses modul."
      icon={Settings}
      badgeText="Aktif di MVP"
      requiredAction="manage_settings"
      tabs={SETTINGS_TABS}
    >
      <div className="space-y-4">
        {/* Toolbar & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama pengguna atau peran..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Semua Role</span>
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-2xs">
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* Tabel User dan Role */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID Pegawai</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Peran & Cakupan</th>
                  <th className="py-3 px-4">Divisi / Wilayah</th>
                  <th className="py-3 px-4 text-center">Status 2FA</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {MOCK_USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{u.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{u.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                        {getRoleBadgeLabel(u.role, u.scope, u.devPersonaKey)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.division} {u.region ? `• ${u.region}` : ""}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.requires2FA ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
                      }`}>
                        {u.requires2FA ? "Wajib 2FA" : "Standar"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-brand-600 hover:text-brand-800 font-semibold text-xs">
                        Edit
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
