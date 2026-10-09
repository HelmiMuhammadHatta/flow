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
  },
  {
    id: "EMP-002",
    name: "Ahmad Fauzi",
    email: "admin.it@cetrofarm.com",
    role: "admin",
    scope: "company",
    division: "Support / Data Center",
    requires2FA: true,
  },
  {
    id: "EMP-003",
    name: "Dewi Lestari",
    email: "finance.corp@cetrofarm.com",
    role: "finance",
    scope: "company",
    division: "Finance Corp",
    requires2FA: true,
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
  },
  {
    id: "EMP-005",
    name: "Ir. Hendra Kusuma",
    email: "director@cetrofarm.com",
    role: "director",
    scope: "company",
    division: "Direksi",
    requires2FA: false,
  },
  {
    id: "EMP-006",
    name: "Maya Indah",
    email: "hr@cetrofarm.com",
    role: "hr",
    scope: "company",
    division: "Support / HR & GA",
    requires2FA: false,
  },
  {
    id: "EMP-007",
    name: "Bambang Wijaya",
    email: "bambang.w@cetrofarm.com",
    role: "employee",
    scope: "own",
    division: "Operation I (Sayuran)",
    requires2FA: false,
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
      const found = MOCK_USERS.find((u) => u.id === parsed.id);
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

export function getRoleBadgeLabel(role: Role, scope?: RoleScope): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin Sistem";
    case "finance":
      return scope === "company" ? "Finance Corp" : "Finance FA (Region)";
    case "director":
      return "Direksi";
    case "manager":
      return "Manajer";
    case "hr":
      return "HR & GA";
    case "employee":
      return "Karyawan";
    default:
      return role;
  }
}
