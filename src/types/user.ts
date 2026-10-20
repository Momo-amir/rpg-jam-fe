import { z } from "zod";

/** Response of /api/me, /api/login and /api/register. */
export const meSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.email(),
  roles: z.array(z.string()),
});

export type User = z.infer<typeof meSchema>;
