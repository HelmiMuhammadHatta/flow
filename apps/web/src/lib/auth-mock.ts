import type { MockUser, Role, RoleScope } from "@/types/auth";

export const MOCK_USERS: MockUser[] = [
  {
    id: "EMP-001",
    name: "Budi Santoso",
    email: "superadmin@cetrofarm.com",
    role: "super_admin",
    scope: "company",
    division: "Executive Office",
    requires2FA: true,
    devPersonaKey: "super_admin",
  },
  {
    id: "EMP-002",
    name: "Ahmad Fauzi",
    email: "admin.it@cetrofarm.com",
    role: "admin",
    scope: "company",
    division: "Support / Data Center",
    requires2FA: true,
    devPersonaKey: "admin",
  },
  {
    id: "EMP-003",
    name: "Dewi Lestari",
    email: "finance.corp@cetrofarm.com",
    role: "finance",
    scope: "company",
    division: "Finance Corp",
    requires2FA: true,
    devPersonaKey: "finance_corp",
  },
  {
    id: "EMP-004",
    name: "Rian Pratama",
    email: "fa.jateng@cetrofarm.com",
    role: "finance",
    scope: "region",
    division: "Operation I (Sayuran)",
    region: "Region I (Jawa Tengah)",
    requires2FA: true,
    devPersonaKey: "finance_fa",
  },
  {
    id: "EMP-005",
    name: "Maya Indah",
    email: "hr@cetrofarm.com",
    role: "hr",
    scope: "company",
    division: "Support / HR & GA",
    requires2FA: false,
    devPersonaKey: "hr",
  },
  {
    id: "EMP-006",
    name: "Bagus Prakoso",
    email: "manager.ops@cetrofarm.com",
    role: "manager",
    scope: "company",
    division: "Operation I (Sayuran)",
    requires2FA: false,
    devPersonaKey: "manager",
  },
  {
    id: "EMP-007",
    name: "Ir. Hendra Kusuma",
    email: "director@cetrofarm.com",
    role: "director",
    scope: "company",
    division: "Direksi",
    requires2FA: false,
    devPersonaKey: "director",
  },
  {
    id: "EMP-008",
    name: "Bambang Wijaya",
    email: "bambang.w@cetrofarm.com",
    role: "employee",
    scope: "own",
    division: "Operation I (Sayuran)",
    requires2FA: false,
    devPersonaKey: "employee",
  },
];

const AUTH_STORAGE_KEY = "centro_mock_active_user";

export function getInitialUser(): MockUser {
  if (typeof window === "undefined") {
    return MOCK_USERS[0];
  }
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = MOCK_USERS.find((u) => u.id === parsed.id || u.devPersonaKey === parsed.devPersonaKey);
      if (found) return found;
    }
  } catch {
    // fallback
  }
  return MOCK_USERS[0]; // default: Super Admin
}

export function saveActiveUser(user: MockUser): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // fallback
    }
  }
}

export function clearActiveUser(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // fallback
    }
  }
}

/**
 * Mengembalikan label chip format standar sesuai poin 8:
 * - Finance Corp • Seluruh region
 * - Finance FA • Region I (Jawa Tengah)
 * - HR & GA • Seluruh region
 * - Manajer • Seluruh region
 * - Direksi • Seluruh region
 * - Admin Sistem • Seluruh region
 * - Super Admin • Seluruh region
 * - Karyawan • Data pribadi
 */
export function getRoleBadgeLabel(role: Role, scope?: RoleScope, devPersonaKey?: string): string {
  if (devPersonaKey === "finance_corp" || (role === "finance" && scope === "company")) {
    return "Finance Corp • Seluruh region";
  }
  if (devPersonaKey === "finance_fa" || (role === "finance" && scope === "region")) {
    return "Finance FA • Region I (Jawa Tengah)";
  }
  switch (role) {
    case "super_admin":
      return "Super Admin • Seluruh region";
    case "admin":
      return "Admin Sistem • Seluruh region";
    case "hr":
      return "HR & GA • Seluruh region";
    case "manager":
      return "Manajer • Seluruh region";
    case "director":
      return "Direksi • Seluruh region";
    case "supervisor":
      return "Supervisor • Data pribadi";
    case "employee":
      return "Karyawan • Data pribadi";
    default:
      return role;
  }
}
