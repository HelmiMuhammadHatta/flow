"use client";

import React from "react";
import { Calendar, FileText, CheckCircle2 } from "lucide-react";

export function SummaryStrip() {
  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs mb-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
        <span>Ringkasan Status Berjalan</span>
        <span className="text-[11px] font-normal text-slate-400">Data dummy pratinjau</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Kolom 1: Periode Akuntansi Berjalan */}
        <div className="flex items-start gap-3.5 pt-2 md:pt-0">
          <div className="p-2.5 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Periode akuntansi berjalan</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>26 Sep – 25 Okt 2026</span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                2026-10
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-emerald-700 font-medium">Status periode: Terbuka</span>
            </div>
          </div>
        </div>

        {/* Kolom 2: Invoice Menunggu Pelunasan */}
        <div className="flex items-start gap-3.5 pt-3 md:pt-0 md:pl-5">
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Invoice belum lunas</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              14 invoice menunggu rekonsiliasi
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Total sisa: <span className="font-semibold text-slate-900">Rp 482.500.000</span>
            </div>
          </div>
        </div>

        {/* Kolom 3: Status Sesi Modul */}
        <div className="flex items-start gap-3.5 pt-3 md:pt-0 md:pl-5">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-brand-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Sesi terpadu CentroID</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Satu sesi untuk seluruh modul
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Tidak ada login terpisah antar modul operasional
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
