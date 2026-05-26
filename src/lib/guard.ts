import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { type User } from "@/types/user";

export async function verifySession(): Promise<User> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

export async function verifyRole(role: string): Promise<User> {
  const user = await verifySession();
  if (!user.roles.includes(role)) redirect("/");
  return user;
}
