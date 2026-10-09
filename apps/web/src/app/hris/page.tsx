"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { UnauthorizedView } from "@/components/auth/UnauthorizedView";
import { canAccess } from "@/config/navigation";
import { MOCK_USERS, getInitialUser, saveActiveUser } from "@/lib/auth-mock";
import type { MockUser } from "@/types/auth";
import { Users, Lock } from "lucide-react";
import Link from "next/link";

function HrisContent() {
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role");

  const roleFromQuery = useMemo(() => {
    if (!queryRole) return null;
    const lower = queryRole.toLowerCase();
    return (
      MOCK_USERS.find(
        (u) =>
          u.devPersonaKey === lower ||
          u.role === lower ||
          (lower === "direksi" && u.role === "director") ||
          (lower === "karyawan" && u.role === "employee") ||
          (lower === "manajer" && u.role === "manager")
      ) ?? null
    );
  }, [queryRole]);

  const [currentUser, setCurrentUser] = useState<MockUser>(() => roleFromQuery ?? getInitialUser());
  const activeUser = roleFromQuery ?? currentUser;

  const hasAccess = canAccess(activeUser, "hris", "read");

  return (
    <AppShell user={activeUser} onUserChange={(u) => { saveActiveUser(u); setCurrentUser(u); }}>
      {!hasAccess ? (
        <UnauthorizedView user={activeUser} moduleName="HRIS" />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/beranda" className="hover:text-brand-600">Beranda</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">HRIS</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Modul HRIS
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kehadiran mandiri, pengajuan cuti, serta pengelolaan data kepegawaian Cetrofarm.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-50 text-gold-600 border border-gold-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-gold-500" />
              <span>Segera hadir (Fase 6)</span>
            </span>
          </div>

          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            Modul HRIS dijadwalkan pada roadmap Fase 6 setelah migrasi data operasional selesai.
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function HrisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat modul HRIS...</div>}>
      <HrisContent />
    </Suspense>
  );
}
