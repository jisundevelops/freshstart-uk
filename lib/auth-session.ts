import { getServerSession } from "next-auth";
import type { AdminRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { AuthError } from "@/lib/errors";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin(roles?: AdminRole[]) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new AuthError("You must be signed in");
  }

  if (roles && roles.length > 0 && !roles.includes(session.user.role)) {
    throw new AuthError("Insufficient permissions");
  }

  return session;
}
