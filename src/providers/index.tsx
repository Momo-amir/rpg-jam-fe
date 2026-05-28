import React from "react";

import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./Theme";
import type { User } from "@/models/schemas/user";

export const Providers: React.FC<{
  children: React.ReactNode;
  user: User | null;
}> = ({ children, user }) => {
  return (
    <ThemeProvider>
      <AuthProvider user={user}>{children}</AuthProvider>
    </ThemeProvider>
  );
};
