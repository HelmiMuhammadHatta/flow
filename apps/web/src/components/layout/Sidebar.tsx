"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Truck,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  X,
  Lock,
  Layers,
  Home,
  Eye,
} from "lucide-react";
import type { MockUser } from "@/types/auth";
import type { NavSubItem } from "@/types/navigation";
import { getNavigationForUser } from "@/config/navigation";

interface SidebarProps {
  user: MockUser;
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Truck,
  CreditCard,
  Users,
  BarChart3,
  Settings,
};

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const allowedModules = getNavigationForUser(user);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Navigasi Utama"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 h-screen max-h-screen bg-brand-900 text-white flex flex-col border-r border-brand-850 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-30 shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-brand-800 lg:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">Navigasi Centro</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-brand-800"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 min-h-0">
          {/* Menu Beranda Utama */}
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-semibold text-emerald-300/70 uppercase tracking-wider">
              Utama
            </div>
            <Link
              href="/beranda"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/beranda"
                  ? "bg-brand-800 text-white border-l-2 border-gold-500 font-semibold"
                  : "text-emerald-100/90 hover:bg-brand-850 hover:text-white"
              }`}
            >
              <Home className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Portal Beranda</span>
            </Link>
          </div>

          {/* Modul-Modul Sesuai Hak Akses Role */}
          <div>
            <div className="px-3 mb-1.5 text-[10px] font-semibold text-emerald-300/70 uppercase tracking-wider flex items-center justify-between">
              <span>Modul Terhubung</span>
              <span className="text-[9px] text-emerald-300/50">RBAC</span>
            </div>

            <div className="space-y-3.5">
              {allowedModules.map((module) => {
                const IconComponent = ICON_MAP[module.iconName] || Layers;
                const isActiveModule = module.status === "active";

                return (
                  <div key={module.id} className="space-y-1">
                    {/* Header Modul (Poin 9: whitespace-nowrap & shrink-0 agar tidak patah baris) */}
                    <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white/95">
                      <div className="flex items-center gap-2 min-w-0">
                        <IconComponent
                          className={`w-4 h-4 shrink-0 ${
                            isActiveModule ? "text-brand-400" : "text-slate-400"
                          }`}
                        />
                        <span className="truncate">{module.name}</span>
                      </div>

                      {/* Badge Modul */}
                      <div className="shrink-0 flex items-center gap-1">
                        {module.isReadOnly && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 font-medium whitespace-nowrap shrink-0 flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5" />
                            <span>Lihat</span>
                          </span>
                        )}
                        {!isActiveModule && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-medium whitespace-nowrap shrink-0 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Segera hadir</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sub Menu Items */}
                    <div className="pl-6 space-y-0.5 border-l border-brand-800/80 ml-5 my-1">
                      {module.items.map((item: NavSubItem) => {
                        const isCurrent = pathname === item.href;
                        const isItemActive = isActiveModule && item.status !== "coming_soon";

                        if (isItemActive) {
                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={onClose}
                              className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                                isCurrent
                                  ? "bg-brand-800 text-white font-medium text-emerald-300"
                                  : "text-emerald-100/80 hover:bg-brand-850 hover:text-white"
                              }`}
                            >
                              <span className="truncate">{item.name}</span>
                            </Link>
                          );
                        }

                        // Jika item statusnya 'coming_soon' (mis. Hutang atau menu HRIS mandiri)
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-1 px-3 py-1.5 rounded-md text-xs text-emerald-200/40 cursor-not-allowed select-none"
                            title="Fitur ini dijadwalkan pada roadmap fase berikutnya"
                          >
                            <span className="truncate">{item.name}</span>
                            <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Sidebar (Poin 10: Dijamin tidak terpotong pada tinggi 800px) */}
        <div className="shrink-0 p-3.5 border-t border-brand-850 bg-brand-950/80 text-[11px] text-emerald-200/80">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              <span>Sesi Terautentikasi</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-300/90 font-semibold bg-brand-900/80 px-1.5 py-0.5 rounded border border-brand-800">
              MVP 1.3
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
