import type { AdminRole } from "@prisma/client";

export const WRITE_ROLES: AdminRole[] = ["SUPER_ADMIN", "EDITOR"];

export function canWrite(role: AdminRole): boolean {
  return WRITE_ROLES.includes(role);
}

export function canManageSettings(role: AdminRole): boolean {
  return role === "SUPER_ADMIN";
}
