import type { MockUser, Role, RoleScope } from "@/types/auth";
import type { ActionType, ModuleId, NavModule, NavSubItem } from "@/types/navigation";

/**
 * Satu sumber kebenaran izin (Single Source of Truth).
 * Digunakan oleh sidebar, kartu modul, dan penjaga rute (route guard).
 */
export function canAccess(
  userOrRole: MockUser | Role,
  moduleId: ModuleId,
  action: ActionType = "read",
  scope?: RoleScope
): boolean {
  let role: Role;
  let userScope: RoleScope;

  if (typeof userOrRole === "string") {
    role = userOrRole;
    userScope = scope ?? (role === "employee" ? "own" : "company");
  } else {
    role = userOrRole.role;
    userScope = userOrRole.scope;
  }

  // Super Admin memiliki akses tak terbatas ke seluruh modul dan aksi
  if (role === "super_admin") {
    return true;
  }

  switch (moduleId) {
    case "hris":
      // Lapisan dasar dapat diakses oleh semua karyawan
      if (action === "read") return true;
      // Aksi kelola departemen/karyawan hanya untuk HR
      return role === "hr";

    case "ops":
      if (role === "finance") return true;
      if (role === "manager" || role === "director") {
        // Manager dan Direksi hanya boleh membaca (read-only)
        return action === "read";
      }
      return false;

    case "finance":
      if (role === "finance") {
        if (action === "close_period") {
          // Hanya Finance Corp (scope: company) yang boleh menutup periode
          return userScope === "company";
        }
        return true;
      }
      if (role === "manager" || role === "director") {
        // Manager dan Direksi hanya boleh membaca (read-only)
        return action === "read";
      }
      return false;

    case "executive":
      return role === "manager" || role === "director";

    case "settings":
      return role === "admin";

    default:
      return false;
  }
}

/**
 * Membangun navigasi berlapis:
 * 1. Lapisan dasar: Modul HRIS menu mandiri ("saya") untuk semua peran tanpa kecuali.
 * 2. Lapisan role: Modul tambahan berdasarkan evaluasi canAccess.
 * Menu yang tidak boleh diakses TIDAK ditampilkan sama sekali.
 */
export function getNavigationForUser(user: MockUser): NavModule[] {
  const modules: NavModule[] = [];

  // ---------------------------------------------------------------------------
  // 1. LAPISAN DASAR: Semua orang adalah karyawan (HRIS mandiri)
  // ---------------------------------------------------------------------------
  const baseHrisItems: NavSubItem[] = [
    {
      id: "absensi_saya",
      name: "Absensi saya",
      href: "/hris/absensi-saya",
      description: "Catatan kehadiran pribadi",
      status: "coming_soon",
      onlyOwn: true,
    },
    {
      id: "cuti_saya",
      name: "Cuti saya",
      href: "/hris/cuti-saya",
      description: "Pengajuan & kuota cuti pribadi",
      status: "coming_soon",
      onlyOwn: true,
    },
    {
      id: "profil_saya",
      name: "Profil saya",
      href: "/hris/profil-saya",
      description: "Data kepegawaian pribadi",
      status: "coming_soon",
      onlyOwn: true,
    },
  ];

  const isHrOrSuper = user.role === "hr" || user.role === "super_admin";
  const hrAdminItems: NavSubItem[] = isHrOrSuper
    ? [
        {
          id: "karyawan",
          name: "Karyawan",
          href: "/hris/karyawan",
          description: "Direktori staf Cetrofarm",
          status: "coming_soon",
        },
        {
          id: "absensi",
          name: "Absensi",
          href: "/hris/absensi",
          description: "Rekap presensi seluruh departemen",
          status: "coming_soon",
        },
        {
          id: "cuti",
          name: "Cuti",
          href: "/hris/cuti",
          description: "Pengelolaan cuti perusahaan",
          status: "coming_soon",
        },
      ]
    : [];

  modules.push({
    id: "hris",
    name: "HRIS",
    shortName: "HR",
    description: isHrOrSuper
      ? "Direktori karyawan, kehadiran departemen, cuti perusahaan, serta menu mandiri."
      : "Akses kehadiran, pengajuan cuti, dan data kepegawaian pribadi Anda.",
    status: "coming_soon",
    iconName: "Users",
    href: "/hris",
    items: [...baseHrisItems, ...hrAdminItems],
  });

  // ---------------------------------------------------------------------------
  // 2. LAPISAN ROLE: Modul tambahan sesuai matriks peran
  // ---------------------------------------------------------------------------
  const isReadOnlyOpsFin = user.role === "manager" || user.role === "director";

  // Operasional (CentroOPS)
  if (canAccess(user, "ops", "read")) {
    modules.push({
      id: "ops",
      name: "Operasional",
      shortName: "OPS",
      description: isReadOnlyOpsFin
        ? "Monitoring PO, penerimaan barang (BTB), invoice, dan pelunasan (Hanya lihat)."
        : "Pengelolaan purchase order, penerimaan barang (BTB), invoice, dan pelunasan.",
      status: "active",
      iconName: "Truck",
      href: "/operasional",
      isReadOnly: isReadOnlyOpsFin,
      items: [
        { id: "po", name: "PO (Pesanan)", href: "/operasional/po", description: "Purchase Order dari pelanggan", status: "active" },
        { id: "btb", name: "BTB (Penerimaan)", href: "/operasional/btb", description: "Bukti Terima Barang fisik", status: "active" },
        { id: "invoice", name: "Invoice", href: "/operasional/invoice", description: "Faktur penjualan & pajak", status: "active" },
        { id: "pelunasan", name: "Pelunasan", href: "/operasional/pelunasan", description: "Alokasi pembayaran & matching", status: "active" },
      ],
    });
  }

  // Keuangan
  if (canAccess(user, "finance", "read")) {
    const finItems: NavSubItem[] = [
      { id: "piutang", name: "Piutang", href: "/keuangan/piutang", description: "Outstanding piutang pelanggan", status: "active" },
      { id: "hutang", name: "Hutang", href: "/keuangan/hutang", description: "Kewajiban vendor (Roadmap Fase 3)", status: "coming_soon" },
      { id: "kas_bank", name: "Kas dan bank", href: "/keuangan/kas-bank", description: "Rekening koran & mutasi kas", status: "active" },
    ];

    // Tutup periode hanya tampil untuk Finance Corp dan Super Admin
    if (canAccess(user, "finance", "close_period")) {
      finItems.push({
        id: "tutup_periode",
        name: "Tutup periode",
        href: "/keuangan/tutup-periode",
        description: "Closing akuntansi tanggal 25 (Khusus Finance Corp & Super Admin)",
        status: "active",
        requiredAction: "close_period",
      });
    }

    modules.push({
      id: "finance",
      name: "Keuangan",
      shortName: "FIN",
      description: isReadOnlyOpsFin
        ? "Monitoring piutang, hutang operasional, dan arus kas bank (Hanya lihat)."
        : "Monitoring piutang, hutang operasional, arus kas bank, dan penutupan periode.",
      status: "active",
      iconName: "CreditCard",
      href: "/keuangan",
      isReadOnly: isReadOnlyOpsFin,
      items: finItems,
    });
  }

  // Dashboard Eksekutif
  if (canAccess(user, "executive", "read")) {
    modules.push({
      id: "executive",
      name: "Dashboard eksekutif",
      shortName: "EXEC",
      description: "Ringkasan metrik pendapatan, piutang, dan performa bisnis untuk manajemen.",
      status: "coming_soon",
      iconName: "BarChart3",
      href: "/executive",
      items: [
        {
          id: "exec_summary",
          name: "Ringkasan eksekutif",
          href: "/executive/ringkasan",
          description: "Indikator kunci bisnis (Read-only)",
          status: "coming_soon",
        },
      ],
    });
  }

  // Pengaturan (Aktif di MVP untuk Admin Sistem & Super Admin)
  if (canAccess(user, "settings", "manage_settings")) {
    modules.push({
      id: "settings",
      name: "Pengaturan",
      shortName: "SET",
      description: "Manajemen pengguna, hak akses role, master data customer, dan parameter sistem.",
      status: "active",
      iconName: "Settings",
      href: "/pengaturan",
      items: [
        { id: "users_roles", name: "User dan role", href: "/pengaturan/users", description: "Manajemen akses & kredensial", status: "active" },
        { id: "master_data", name: "Master data", href: "/pengaturan/master-data", description: "Data pelanggan, divisi & region", status: "active" },
        { id: "system_settings", name: "Setting sistem", href: "/pengaturan/sistem", description: "Konfigurasi toleransi matching", status: "active" },
      ],
    });
  }

  return modules;
}
