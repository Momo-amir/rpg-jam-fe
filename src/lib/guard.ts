import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { type User } from "@/models/schemas/user";

export async function verifySession(): Promise<User> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

// roles are post-MVP — placeholder until C# returns them in the JWT/response
export async function verifyRole(_role: string): Promise<User> {
  const user = await verifySession();
  redirect("/");
  return user;
}
