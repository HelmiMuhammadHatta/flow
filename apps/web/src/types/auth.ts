export type Role =
  | "super_admin"
  | "admin"
  | "finance"
  | "manager"
  | "director"
  | "hr"
  | "employee";

export type RoleScope = "own" | "department" | "region" | "division" | "company";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  scope: RoleScope;
  division?: string;
  region?: string;
  avatarUrl?: string;
  requires2FA: boolean;
}

export type LoginState = "default" | "loading" | "invalid" | "locked" | "2fa";
