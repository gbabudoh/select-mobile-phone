import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import { NextResponse } from "next/server";

export async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "SUPER_ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 }), session: null };
  }

  return { error: null, session };
}
