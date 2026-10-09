"use client";

import React, { useState } from "react";
import { MOCK_USERS, getRoleBadgeLabel, saveActiveUser } from "@/lib/auth-mock";
import type { MockUser } from "@/types/auth";
import { Shield, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RoleSwitcherDevProps {
  currentUser: MockUser;
  onUserChange?: (user: MockUser) => void;
}

export function RoleSwitcherDev({ currentUser, onUserChange }: RoleSwitcherDevProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Dapat dinonaktifkan secara manual jika NEXT_PUBLIC_DISABLE_DEV_SWITCHER diset ke 'true'
  if (process.env.NEXT_PUBLIC_DISABLE_DEV_SWITCHER === "true") {
    return null;
  }

  const handleSelectUser = (user: MockUser) => {
    saveActiveUser(user);
    if (onUserChange) {
      onUserChange(user);
    } else {
      router.refresh();
    }
    setIsOpen(false);
  };

  return (
    <aside aria-label="Alat Pengembang Peran" className="fixed bottom-4 right-4 z-50 font-sans">
      <div className="relative">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-brand-900 border border-brand-500/50 rounded-full shadow-lg hover:bg-brand-850 hover:border-gold-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          title="Mode Pengembang: Ganti Peran & State"
        >
          <Shield className="w-3.5 h-3.5 text-gold-500" />
          <span className="font-semibold text-gold-400">DEV</span>
          <span className="text-slate-300">|</span>
          <span className="text-white max-w-[170px] truncate">
            {getRoleBadgeLabel(currentUser.role, currentUser.scope, currentUser.devPersonaKey)}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute bottom-12 right-0 w-84 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                  Role Switcher (8 Persona Dev)
                </span>
              </div>
              <span className="text-[10px] bg-gold-50 text-gold-600 font-semibold px-2 py-0.5 rounded-full border border-gold-200">
                Mock RBAC
              </span>
            </div>

            {/* List of 8 Mock Roles */}
            <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-1">
              <p className="text-[11px] font-medium text-slate-500 uppercase px-1">Pilih Persona Dev:</p>
              {MOCK_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start justify-between ${
                      isSelected
                        ? "bg-brand-50 border border-brand-500/30 text-brand-900 font-medium"
                        : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {user.name}
                        {user.requires2FA && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-normal" title="Wajib 2FA">
                            2FA
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {getRoleBadgeLabel(user.role, user.scope, user.devPersonaKey)}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Quick State Links for Login Testing */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] font-medium text-slate-500 uppercase mb-2">Uji State Halaman Login:</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <Link
                  href="/login?state=default"
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-colors"
                >
                  Default
                </Link>
                <Link
                  href="/login?state=loading"
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-colors"
                >
                  Loading
                </Link>
                <Link
                  href="/login?state=invalid"
                  className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-center transition-colors"
                >
                  Salah Password
                </Link>
                <Link
                  href="/login?state=locked"
                  className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-center transition-colors"
                >
                  Akun Terkunci
                </Link>
                <Link
                  href="/login?state=2fa"
                  className="col-span-2 px-2 py-1 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 text-center transition-colors font-medium flex items-center justify-center gap-1"
                >
                  <Shield className="w-3 h-3" /> Langkah 2FA (6 Digit)
                </Link>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[10px] text-slate-400 text-center border-t border-slate-50">
              Otomatis dihapus dari build production.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
