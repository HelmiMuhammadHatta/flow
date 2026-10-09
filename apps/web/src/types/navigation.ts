export type ModuleId = "hris" | "ops" | "finance" | "executive" | "settings";
export type ModuleStatus = "active" | "coming_soon";
export type ActionType = "read" | "write" | "close_period" | "manage_settings";

export interface NavSubItem {
  id: string;
  name: string;
  href: string;
  description?: string;
  status?: ModuleStatus;
  requiredAction?: ActionType;
  onlyOwn?: boolean;
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
  isReadOnly?: boolean;
}
