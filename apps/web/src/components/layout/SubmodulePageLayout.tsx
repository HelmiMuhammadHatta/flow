"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { UnauthorizedView } from "@/components/auth/UnauthorizedView";
import { canAccess, isExecutiveRole } from "@/config/navigation";
import { useActiveUser } from "@/hooks/useActiveUser";
import type { ModuleId, ActionType } from "@/types/navigation";
import { Eye, ArrowLeft } from "lucide-react";

export interface SubmoduleTab {
  id: string;
  name: string;
  href: string;
  status?: "active" | "coming_soon";
}

interface SubmodulePageLayoutProps {
  moduleId: ModuleId;
  moduleName: string;
  moduleHref: string;
  submoduleTitle: string;
  submoduleDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText?: string;
  requiredAction?: ActionType;
  tabs?: SubmoduleTab[];
  children: React.ReactNode;
}

function SubmoduleContent({
  moduleId,
  moduleName,
  moduleHref,
  submoduleTitle,
  submoduleDesc,
  icon: Icon,
  badgeText,
  requiredAction = "read",
  tabs = [],
  children,
}: SubmodulePageLayoutProps) {
  const pathname = usePathname();
  const { activeUser, handleUserChange } = useActiveUser();

  const hasAccess = canAccess(activeUser, moduleId, requiredAction);
  const isReadOnly = isExecutiveRole(activeUser.role);

  return (
    <AppShell user={activeUser} onUserChange={handleUserChange}>
      {!hasAccess ? (
        <UnauthorizedView
          user={activeUser}
          moduleName={`${moduleName} • ${submoduleTitle}`}
        />
      ) : (
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/beranda" className="hover:text-brand-600 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href={moduleHref} className="hover:text-brand-600 transition-colors">
              {moduleName}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{submoduleTitle}</span>
          </div>

          {/* Header Submodul */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-600">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {submoduleTitle}
                  </h1>
                  {isReadOnly && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                      <Eye className="w-3 h-3 text-sky-600" />
                      <span>Hanya lihat</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{submoduleDesc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {badgeText && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {badgeText}
                </span>
              )}
              <Link
                href={moduleHref}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Induk Modul</span>
              </Link>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          {tabs.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
              <Link
                href={moduleHref}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  pathname === moduleHref
                    ? "bg-brand-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Ringkasan {moduleName}
              </Link>
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                      isActive
                        ? "bg-brand-900 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{tab.name}</span>
                    {tab.status === "coming_soon" && (
                      <span className="text-[10px] px-1 rounded bg-gold-50 text-gold-600 border border-gold-200">
                        Fase 3
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Read-only Alert jika role Manajer / Direksi */}
          {isReadOnly && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs">
              <Eye className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Mode Monitoring:</strong> Peran Anda memiliki hak akses <em>Hanya lihat (Read-only)</em>. Form penambahan dan modifikasi data dinonaktifkan.
              </span>
            </div>
          )}

          {/* Konten Halaman */}
          {children}
        </div>
      )}
    </AppShell>
  );
}

export function SubmodulePageLayout(props: SubmodulePageLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">
          Memuat halaman {props.submoduleTitle}...
        </div>
      }
    >
      <SubmoduleContent {...props} />
    </Suspense>
  );
}
