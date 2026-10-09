"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { TwoFactorStep } from "@/components/auth/TwoFactorStep";
import { RoleSwitcherDev } from "@/components/dev/RoleSwitcherDev";
import { MOCK_USERS, getInitialUser, saveActiveUser } from "@/lib/auth-mock";
import type { LoginState, MockUser } from "@/types/auth";
import { CheckCircle2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameter ?state=default|loading|invalid|locked|2fa
  const queryState = (searchParams.get("state") as LoginState) || "default";

  const [activeUser, setActiveUser] = useState<MockUser>(getInitialUser);
  const [stateOverride, setStateOverride] = useState<LoginState | null>(null);
  const [pending2FAUser, setPending2FAUser] = useState<MockUser | null>(null);

  const effectiveState: LoginState = stateOverride ?? queryState;
  const userFor2FA = pending2FAUser ?? (effectiveState === "2fa" ? MOCK_USERS[0] : null);

  const handleLoginSuccess = (user: MockUser) => {
    saveActiveUser(user);
    setActiveUser(user);
    router.push("/beranda");
  };

  const handleRequires2FA = (user: MockUser) => {
    setPending2FAUser(user);
    setStateOverride("2fa");
  };

  const handle2FAVerify = () => {
    if (userFor2FA) {
      saveActiveUser(userFor2FA);
      setActiveUser(userFor2FA);
      router.push("/beranda");
    }
  };

  const handleCancel2FA = () => {
    setPending2FAUser(null);
    setStateOverride("default");
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-slate-800">
      {/* =========================================================================
          KOLOM KIRI: Panel Branding Hijau Tua brand-900 (Desktop only, hidden on mobile)
          ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-900 flex-col justify-between p-12 overflow-hidden text-white border-r border-brand-800">
        {/* Subtle decorative background ring & pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border-[40px] border-brand-500"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border-[30px] border-gold-500"></div>
          <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full border border-brand-300"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/80 border border-brand-700/60 text-xs font-medium text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-brand-400"></span>
            <span>Centro Platform • v1.3</span>
          </div>
        </div>

        {/* Central Logo & Brand Proposition */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          {/* Logo Asli Cetrofarm */}
          <div className="mb-8">
            <div className="inline-block bg-white rounded-2xl p-3 shadow-md border border-brand-800/60">
              <div className="relative w-72 h-24">
                <Image
                  src="/brand/logo.png"
                  alt="Logo Resmi Cetrofarm"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Value Proposition Statement */}
          <h2 className="text-3xl font-semibold tracking-tight text-white leading-snug">
            Satu pintu untuk operasional, keuangan, dan HR Cetrofarm
          </h2>

          <div className="w-16 h-1 bg-gold-500 rounded-full my-6"></div>

          <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
            Platform terpadu untuk integrasi data transaksi, rekonsiliasi PO dan faktur,
            pengelolaan kehadiran, serta visibilitas operasional modern agrikultur Cetrofarm.
          </p>

          <div className="mt-8 space-y-3 text-xs text-emerald-100/90">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Satu identitas tunggal EmployeeID untuk seluruh layanan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Rekonsiliasi transaksi operasional dan invoice real time</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Standar keamanan enterprise dengan autentikasi 2FA TOTP</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-emerald-200/60">
          © 2026 PT Cetrofarm Agrikultur Indonesia. Seluruh hak cipta dilindungi.
        </div>
      </div>

      {/* =========================================================================
          KOLOM KANAN: Kartu Login (Mobile & Desktop)
          ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-8 py-10 lg:px-12">
        {/* Mobile Header Logo (hanya tampil di layar kecil / mobile) */}
        <div className="lg:hidden w-full max-w-md mb-6 flex flex-col items-center text-center">
          <div className="relative w-64 h-24 mb-2">
            <Image
              src="/brand/logo.png"
              alt="Logo Resmi Cetrofarm"
              fill
              priority
              className="object-contain"
            />
          </div>
          <p className="text-xs text-slate-500">
            Satu pintu untuk operasional, keuangan, dan HR Cetrofarm
          </p>
        </div>

        {/* Kartu Login Utama */}
        <main className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 transition-all">
          {effectiveState === "2fa" && userFor2FA ? (
            <TwoFactorStep
              user={userFor2FA}
              onVerify={handle2FAVerify}
              onCancel={handleCancel2FA}
            />
          ) : (
            <LoginForm
              key={effectiveState}
              initialState={effectiveState}
              onSuccess={handleLoginSuccess}
              onRequires2FA={handleRequires2FA}
            />
          )}
        </main>
      </div>

      {/* Role Switcher Dev Tool */}
      <RoleSwitcherDev
        currentUser={activeUser}
        onUserChange={(newUser) => {
          setActiveUser(newUser);
          if (effectiveState === "2fa") {
            setPending2FAUser(newUser);
          }
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
