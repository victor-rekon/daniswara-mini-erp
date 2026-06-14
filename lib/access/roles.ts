export const ROLE_COOKIE_NAME = "daniswara_user_role";

export const USER_ROLES = ["owner", "admin", "finance", "staff"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  finance: "Finance",
  staff: "Staff",
};

export function normalizeRole(value: unknown): UserRole {
  return USER_ROLES.includes(value as UserRole) ? (value as UserRole) : "owner";
}

const ACCESS_RULES: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/dashboard", roles: ["owner", "admin", "finance", "staff"] },
  { prefix: "/input", roles: ["owner", "admin"] },
  { prefix: "/production", roles: ["owner", "admin", "staff"] },
  { prefix: "/quotation", roles: ["owner", "admin", "staff"] },
  { prefix: "/sales-delivery", roles: ["owner", "admin", "staff"] },
  { prefix: "/invoice-payment", roles: ["owner", "admin", "finance"] },
  { prefix: "/accounting", roles: ["owner", "admin", "finance"] },
  { prefix: "/reports", roles: ["owner", "admin", "finance"] },
  { prefix: "/activity-log", roles: ["owner", "admin", "finance"] },
  { prefix: "/system-status", roles: ["owner", "admin"] },
  { prefix: "/system-test", roles: ["owner", "admin"] },
  { prefix: "/qa-center", roles: ["owner", "admin"] },
  { prefix: "/users", roles: ["owner", "admin"] },
  { prefix: "/master-data", roles: ["owner", "admin"] },
  { prefix: "/settings", roles: ["owner", "admin"] },
];

export function canAccessPath(roleValue: unknown, pathname: string) {
  const role = normalizeRole(roleValue);
  const rule = ACCESS_RULES.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`));
  if (!rule) return true;
  return rule.roles.includes(role);
}

export function getFallbackPath() {
  return "/dashboard";
}

export function canAccessHref(roleValue: unknown, href: string) {
  return canAccessPath(roleValue, href);
}

export function roleAccessRulesForQa() {
  return ACCESS_RULES.map((rule) => ({ ...rule, roles: [...rule.roles] }));
}
