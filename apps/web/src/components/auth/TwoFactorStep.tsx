"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import type { MockUser } from "@/types/auth";

interface TwoFactorStepProps {
  user: MockUser;
  onVerify: (code: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TwoFactorStep({ user, onVerify, onCancel, isLoading = false }: TwoFactorStepProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Fokuskan input pertama saat komponen dimuat
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (errorMsg) setErrorMsg(null);
    const sanitized = value.replace(/[^0-9]/g, "");

    // Jika user paste 6 digit angka
    if (sanitized.length > 1) {
      const pasteDigits = sanitized.slice(0, 6).split("");
      const newDigits = [...digits];
      pasteDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextFocus = Math.min(pasteDigits.length, 5);
      inputsRef.current[nextFocus]?.focus();
      if (newDigits.every((d) => d !== "")) {
        onVerify(newDigits.join(""));
      }
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = sanitized;
    setDigits(newDigits);

    // Auto-focus ke input berikutnya jika terisi
    if (sanitized && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit bila ke-6 digit sudah lengkap
    if (newDigits.every((d) => d !== "") && sanitized !== "") {
      onVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setErrorMsg("Masukkan 6 digit kode keamanan dengan lengkap.");
      return;
    }
    onVerify(code);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-600 mb-3 shadow-xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Verifikasi dua langkah</h2>
        <p className="mt-1 text-sm text-slate-600">
          Masukkan 6 digit kode dari aplikasi autentikator untuk akun{" "}
          <span className="font-medium text-slate-800">{user.email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-slate-700 text-center mb-3">
            Kode Keamanan (TOTP)
          </label>
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={(e) => {
            const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
            if (pasteData.length === 6) {
              e.preventDefault();
              handleChange(0, pasteData);
            }
          }}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                aria-label={`Digit ${idx + 1}`}
                className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all disabled:bg-slate-100"
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || digits.some((d) => d === "")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verifikasi</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke halaman masuk</span>
          </button>
        </div>

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-500">
            Peran <span className="font-semibold text-slate-700">{user.role}</span> diwajibkan menggunakan verifikasi 2FA sesuai standar keamanan Centro.
          </p>
        </div>
      </form>
    </div>
  );
}
