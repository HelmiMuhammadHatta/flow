"use client";

import React from "react";
import Link from "next/link";
import {
  Truck,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  Lock,
  Layers,
} from "lucide-react";
import type { NavModule } from "@/types/navigation";

interface ModuleCardProps {
  module: NavModule;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Truck,
  CreditCard,
  Users,
  BarChart3,
  Settings,
};

export function ModuleCard({ module }: ModuleCardProps) {
  const IconComponent = ICON_MAP[module.iconName] || Layers;
  const isActive = module.status === "active";
  const itemCount = module.items.length;

  return (
    <div
      className={`bg-white rounded-xl border transition-all p-6 flex flex-col justify-between ${
        isActive
          ? "border-slate-200/90 shadow-2xs hover:shadow-md hover:border-brand-500/40"
          : "border-slate-200/60 bg-slate-50/50 shadow-none"
      }`}
    >
      <div>
        {/* Header Kartu: Ikon & Badge Status */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isActive
                ? "bg-brand-50 border border-brand-200/70 text-brand-600 shadow-2xs"
                : "bg-slate-100 border border-slate-200 text-slate-400"
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div>
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>Aktif di MVP</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gold-50 text-gold-600 border border-gold-200">
                <Lock className="w-3 h-3 text-gold-500" />
                <span>Segera hadir</span>
              </span>
            )}
          </div>
        </div>

        {/* Judul & Deskripsi */}
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {module.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed min-h-[36px]">
          {module.description}
        </p>

        {/* Sub Menu Links */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu ({itemCount} fitur)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {module.items.map((item) => (
              <span
                key={item.id}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 cursor-pointer"
                    : "bg-slate-100/70 text-slate-400 cursor-not-allowed select-none"
                }`}
                title={item.description}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tombol Aksi di Bagian Bawah */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        {isActive ? (
          <Link
            href={module.href}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
          >
            <span>Buka modul {module.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs cursor-not-allowed select-none"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Roadmap Fase Selanjutnya</span>
          </button>
        )}
      </div>
    </div>
  );
}
