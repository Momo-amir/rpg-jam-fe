import { z } from "zod";

export const userSchema = z.object({
  identifier: z.string(),
  displayName: z.string(),
  email: z.email(),
});

export type User = z.infer<typeof userSchema>;
