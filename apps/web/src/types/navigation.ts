import type { Role, RoleScope } from "./auth";

export type ModuleId = "hris" | "ops" | "finance" | "executive" | "settings";
export type ModuleStatus = "active" | "coming_soon";

export interface NavSubItem {
  id: string;
  name: string;
  href: string;
  description?: string;
  badge?: string;
  requiredScope?: RoleScope; // misal 'company' untuk Tutup periode
  onlyOwn?: boolean; // untuk employee
}

export interface NavModule {
  id: ModuleId;
  name: string;
  shortName: string;
  description: string;
  status: ModuleStatus;
  iconName: string;
  href: string;
  items: NavSubItem[];
  allowedRoles: Role[];
}
