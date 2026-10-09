"use client";

import React from "react";
import { SubmodulePageLayout, type SubmoduleTab } from "@/components/layout/SubmodulePageLayout";
import { CreditCard, Lock } from "lucide-react";
import Link from "next/link";

const FIN_TABS: SubmoduleTab[] = [
  { id: "piutang", name: "Piutang", href: "/keuangan/piutang", status: "active" },
  { id: "hutang", name: "Hutang", href: "/keuangan/hutang", status: "coming_soon" },
  { id: "kas_bank", name: "Kas dan Bank", href: "/keuangan/kas-bank", status: "active" },
  { id: "tutup_periode", name: "Tutup Periode", href: "/keuangan/tutup-periode", status: "active" },
];

export default function HutangPage() {
  return (
    <SubmodulePageLayout
      moduleId="finance"
      moduleName="Keuangan"
      moduleHref="/keuangan"
      submoduleTitle="Hutang Vendor (AP)"
      submoduleDesc="Pengelolaan kewajiban pembayaran petani mitra, vendor sarana produksi, dan termin pembayaran."
      icon={CreditCard}
      badgeText="Roadmap Fase 3"
      tabs={FIN_TABS}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-gold-50 border border-gold-200 text-gold-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
          Segera Hadir • Fase 3
        </span>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-3">
          Modul Hutang Vendor (Accounts Payable)
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Pencatatan faktur pembelian petani mitra, jadwal pembayaran sarana produksi pertanian, serta rekonsiliasi vendor bills dijadwalkan pada pengembangan <strong>Fase 3 (Procurement & Payables)</strong>.
        </p>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-3">
          <Link
            href="/keuangan/piutang"
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs transition-colors shadow-2xs"
          >
            Lihat Modul Piutang
          </Link>
          <Link
            href="/keuangan"
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
          >
            Kembali ke Keuangan
          </Link>
        </div>
      </div>
    </SubmodulePageLayout>
  );
}
