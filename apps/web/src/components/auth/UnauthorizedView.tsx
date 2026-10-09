"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Home } from "lucide-react";
import type { MockUser } from "@/types/auth";
import { getRoleBadgeLabel } from "@/lib/auth-mock";

interface UnauthorizedViewProps {
  user: MockUser;
  moduleName: string;
}

export function UnauthorizedView({ user, moduleName }: UnauthorizedViewProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
          Akses Ditolak
        </span>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-3">
          Anda tidak punya akses ke modul ini
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Akun Anda saat ini masuk sebagai{" "}
          <strong className="text-slate-900">{user.name}</strong> dengan peran{" "}
          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {getRoleBadgeLabel(user.role, user.scope, user.devPersonaKey)}
          </span>
          . Peran ini tidak memiliki wewenang untuk membuka modul <strong className="text-slate-800">{moduleName}</strong>.
        </p>

        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
          <Link
            href="/beranda"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <p className="text-[11px] text-slate-400 pt-1">
            Jika Anda memerlukan akses, silakan ajukan izin ke atasan atau tim IT Data Center Cetrofarm.
          </p>
        </div>
      </div>
    </div>
  );
}
