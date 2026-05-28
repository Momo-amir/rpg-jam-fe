import { z } from "zod";

export const userSchema = z.object({
  sub: z.string(),
  email: z.email(),
  unique_name: z.string(),
  roles: z.array(z.string()).optional().default([]),
});

export type User = z.infer<typeof userSchema>;
