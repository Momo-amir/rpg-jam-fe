import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  displayName: z.string(),
  roles: z.array(z.string()).optional().default([]),
});

export type User = z.infer<typeof userSchema>;
