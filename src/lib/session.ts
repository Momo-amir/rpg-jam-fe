import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { userSchema, type User } from "@/types/user";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const getSession = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return userSchema.parse({
      identifier: payload["unique_name"],
      displayName: payload["name"],
      email: payload["email"],
    });
  } catch {
    return null;
  }
});
