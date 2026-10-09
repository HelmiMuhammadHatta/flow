export type Role =
  | "super_admin"
  | "admin"
  | "finance"
  | "manager"
  | "director"
  | "hr"
  | "supervisor"
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
  devPersonaKey?: string;
}

export type LoginState = "default" | "loading" | "invalid" | "locked" | "2fa";
