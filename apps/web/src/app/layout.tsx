import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Centro Platform - Cetrofarm",
  description: "Satu pintu untuk operasional, keuangan, dan HR Cetrofarm.",
  icons: {
    icon: "/brand/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-slate-50 text-slate-800 font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
