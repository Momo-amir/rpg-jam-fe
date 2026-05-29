import { z } from "zod";

export const userSchema = z.object({
  identifier: z.string(),
  displayName: z.string(),
  email: z.email(),
  roles: z.array(z.string()).optional().default([]),
});

export type User = z.infer<typeof userSchema>;
