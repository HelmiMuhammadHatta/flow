"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Shield, ChevronDown } from "lucide-react";
import type { MockUser } from "@/types/auth";
import { getRoleBadgeLabel, clearActiveUser } from "@/lib/auth-mock";

interface HeaderProps {
  user: MockUser;
  onToggleSidebar: () => void;
}

export function Header({ user, onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearActiveUser();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-900 border-b border-brand-850 text-white shadow-xs">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Sisi Kiri: Toggle Sidebar (Mobile) & Logo Cetrofarm */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Buka menu navigasi"
            className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/beranda" className="flex items-center group" title="Cetrofarm Portal">
            <div className="relative w-28 sm:w-36 h-8 sm:h-9">
              <Image
                src="/brand/logo.png"
                alt="Cetrofarm"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Sisi Kanan: Notifikasi & Profil Akun */}
        <div className="flex items-center gap-3">
          {/* Badge Peran */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-800/80 border border-brand-700/80 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
            <span className="font-medium text-emerald-100">
              {getRoleBadgeLabel(user.role, user.scope, user.devPersonaKey)}
            </span>
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-full sm:rounded-lg hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-brand-700 border border-brand-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {getInitials(user.name)}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-semibold text-white leading-tight">
                  {user.name}
                </div>
                <div className="text-[11px] text-emerald-300 leading-none">
                  {user.division || "Cetrofarm"}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300 hidden sm:block" />
            </button>

            {/* Dropdown Menu Akun */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-brand-50 text-brand-700 border border-brand-200">
                    {getRoleBadgeLabel(user.role, user.scope, user.devPersonaKey)}
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <div className="px-4 py-2 text-slate-600 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-500" />
                    <span>ID Karyawan: {user.id}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Centro</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
