import type { MockUser } from "@/types/auth";
import type { NavModule, NavSubItem } from "@/types/navigation";

export const ALL_MODULES: NavModule[] = [
  {
    id: "ops",
    name: "Operasional",
    shortName: "OPS",
    description: "Pengelolaan purchase order, penerimaan barang (BTB), invoice, dan pelunasan.",
    status: "active",
    iconName: "Truck",
    href: "/operasional",
    allowedRoles: ["super_admin", "finance"],
    items: [
      { id: "po", name: "PO (Pesanan)", href: "/operasional/po", description: "Purchase Order dari pelanggan" },
      { id: "btb", name: "BTB (Penerimaan)", href: "/operasional/btb", description: "Bukti Terima Barang fisik" },
      { id: "invoice", name: "Invoice", href: "/operasional/invoice", description: "Faktur penjualan & pajak" },
      { id: "pelunasan", name: "Pelunasan", href: "/operasional/pelunasan", description: "Alokasi pembayaran & matching" },
    ],
  },
  {
    id: "finance",
    name: "Keuangan",
    shortName: "FIN",
    description: "Monitoring piutang, hutang operasional, arus kas bank, dan penutupan periode.",
    status: "active",
    iconName: "CreditCard",
    href: "/keuangan",
    allowedRoles: ["super_admin", "finance"],
    items: [
      { id: "piutang", name: "Piutang", href: "/keuangan/piutang", description: "Outstanding piutang pelanggan" },
      { id: "hutang", name: "Hutang", href: "/keuangan/hutang", description: "Kewajiban pembayaran berjalan" },
      { id: "kas_bank", name: "Kas dan bank", href: "/keuangan/kas-bank", description: "Rekening koran & mutasi kas" },
      {
        id: "tutup_periode",
        name: "Tutup periode",
        href: "/keuangan/tutup-periode",
        description: "Closing akuntansi tanggal 25 (Khusus Corp & Super Admin)",
        requiredScope: "company",
      },
    ],
  },
  {
    id: "hris",
    name: "HRIS",
    shortName: "HR",
    description: "Data kepegawaian, absensi harian, pengajuan cuti, dan kehadiran karyawan.",
    status: "coming_soon",
    iconName: "Users",
    href: "/hris",
    allowedRoles: ["super_admin", "hr", "employee"],
    items: [
      { id: "karyawan", name: "Karyawan", href: "/hris/karyawan", description: "Direktori staf Cetrofarm" },
      { id: "absensi", name: "Absensi", href: "/hris/absensi", description: "Log presensi & check-in" },
      { id: "cuti", name: "Cuti", href: "/hris/cuti", description: "Pengajuan & kuota cuti tahunan" },
    ],
  },
  {
    id: "executive",
    name: "Dashboard eksekutif",
    shortName: "EXEC",
    description: "Ringkasan metrik pendapatan, piutang, dan performa bisnis untuk manajemen.",
    status: "coming_soon",
    iconName: "BarChart3",
    href: "/executive",
    allowedRoles: ["super_admin", "manager", "director"],
    items: [
      { id: "exec_summary", name: "Ringkasan eksekutif", href: "/executive/ringkasan", description: "Indikator kunci bisnis (Read-only)" },
    ],
  },
  {
    id: "settings",
    name: "Pengaturan",
    shortName: "SET",
    description: "Manajemen pengguna, hak akses role, master data customer, dan parameter sistem.",
    status: "coming_soon",
    iconName: "Settings",
    href: "/pengaturan",
    allowedRoles: ["super_admin", "admin"],
    items: [
      { id: "users_roles", name: "User dan role", href: "/pengaturan/users", description: "Manajemen akses & kredensial" },
      { id: "master_data", name: "Master data", href: "/pengaturan/master-data", description: "Data pelanggan, divisi & region" },
      { id: "system_settings", name: "Setting sistem", href: "/pengaturan/sistem", description: "Konfigurasi toleransi matching" },
    ],
  },
];

/**
 * Filter modul dan subitem navigasi sesuai peran dan scope pengguna.
 * Menu yang tidak boleh diakses TIDAK dirender sama sekali.
 */
export function getNavigationForUser(user: MockUser): NavModule[] {
  return ALL_MODULES
    .filter((mod) => mod.allowedRoles.includes(user.role))
    .map((mod) => {
      // Spesifik untuk modul HRIS bila role adalah employee (hanya milik sendiri)
      if (mod.id === "hris" && user.role === "employee") {
        const employeeItems: NavSubItem[] = [
          { id: "absensi_saya", name: "Absensi saya", href: "/hris/absensi-saya", description: "Catatan presensi pribadi", onlyOwn: true },
          { id: "cuti_saya", name: "Cuti saya", href: "/hris/cuti-saya", description: "Saldo & pengajuan cuti pribadi", onlyOwn: true },
        ];
        return {
          ...mod,
          description: "Akses data kehadiran dan cuti pribadi Anda.",
          items: employeeItems,
        };
      }

      // Filter subitem berdasarkan scope (misal Tutup Periode butuh company scope)
      const filteredItems = mod.items.filter((item) => {
        if (item.requiredScope === "company") {
          return user.role === "super_admin" || user.scope === "company";
        }
        return true;
      });

      return {
        ...mod,
        items: filteredItems,
      };
    })
    .filter((mod) => mod.items.length > 0 || mod.id === "executive");
}
