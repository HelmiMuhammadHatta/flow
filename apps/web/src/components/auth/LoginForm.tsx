"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, ClockAlert } from "lucide-react";
import type { LoginState, MockUser } from "@/types/auth";
import { MOCK_USERS, saveActiveUser } from "@/lib/auth-mock";

interface LoginFormProps {
  initialState?: LoginState;
  onSuccess: (user: MockUser) => void;
  onRequires2FA: (user: MockUser) => void;
}

export function LoginForm({
  initialState = "default",
  onSuccess,
  onRequires2FA,
}: LoginFormProps) {
  const [email, setEmail] = useState<string>("superadmin@cetrofarm.com");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<LoginState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(initialState === "loading");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentState === "locked") {
      return;
    }

    setIsSubmitting(true);
    setCurrentState("loading");

    // Simulasi proses login
    setTimeout(() => {
      // Cari kecocokan user mock berdasarkan input email
      const normalizedEmail = email.trim().toLowerCase();
      const matchedUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      // Jika email tidak terdaftar atau password sengaja salah
      if (password === "salah" || password === "error" || !matchedUser) {
        setIsSubmitting(false);
        setCurrentState("invalid");
        return;
      }

      setIsSubmitting(false);

      // Cek apakah user wajib 2FA (super_admin, admin, finance)
      if (matchedUser.requires2FA) {
        onRequires2FA(matchedUser);
      } else {
        saveActiveUser(matchedUser);
        onSuccess(matchedUser);
      }
    }, 700);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setCurrentState("loading");
    setTimeout(() => {
      // Default Google login ke super admin
      const googleUser = MOCK_USERS[0];
      setIsSubmitting(false);
      if (googleUser.requires2FA) {
        onRequires2FA(googleUser);
      } else {
        saveActiveUser(googleUser);
        onSuccess(googleUser);
      }
    }, 600);
  };

  const isLocked = currentState === "locked";
  const isInvalid = currentState === "invalid";
  const isLoading = isSubmitting || currentState === "loading";

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk ke Centro</h1>
        <p className="mt-1 text-sm text-slate-600">
          Masukkan kredensial akun Cetrofarm Anda untuk melanjutkan
        </p>
      </div>

      {/* State Notifikasi: Akun Terkunci (Rate Limit) */}
      {isLocked && (
        <div
          role="alert"
          className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-900 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <ClockAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Akun terkunci sementara karena terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.
          </div>
        </div>
      )}

      {/* State Notifikasi: Salah Email / Password */}
      {isInvalid && (
        <div
          role="alert"
          className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-900 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Email atau kata sandi tidak cocok. Silakan periksa kembali.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email perusahaan
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading || isLocked}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (isInvalid) setCurrentState("default");
            }}
            placeholder="nama@cetrofarm.com"
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>

        {/* Input Kata Sandi */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
              Kata sandi
            </label>
            <a
              href="#lupa-password"
              onClick={(e) => {
                e.preventDefault();
                alert("Silakan hubungi administrator IT Data Center Cetrofarm untuk pemulihan kata sandi.");
              }}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 focus:outline-none focus:underline"
            >
              Lupa password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isLoading || isLocked}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (isInvalid) setCurrentState("default");
              }}
              placeholder="Masukkan kata sandi Anda"
              className="w-full px-3.5 py-2.5 pr-10 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
            />
            <button
              type="button"
              disabled={isLoading || isLocked}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tombol Utama Masuk (Satu tombol primer per layar) */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-login-submit"
            disabled={isLoading || isLocked}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </button>
        </div>

        {/* Pemisah atau */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-medium">atau</span>
          </div>
        </div>

        {/* Tombol Masuk dengan Google */}
        <button
          type="button"
          id="btn-login-google"
          disabled={isLoading || isLocked}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-sm transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {/* Ikon Resmi Google */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Masuk dengan Google</span>
        </button>
      </form>

      {/* Petunjuk Pengujian Cepat */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          Sistem internal Centro Platform • Cetrofarm © 2026
        </p>
      </div>
    </div>
  );
}
