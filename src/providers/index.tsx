import React from "react";

import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./Theme";
import { type User } from "@/types/user";

export const Providers: React.FC<{
  children: React.ReactNode;
  initialUser?: User | null;
}> = ({ children, initialUser }) => {
  return (
    <ThemeProvider>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
    </ThemeProvider>
  );
};
