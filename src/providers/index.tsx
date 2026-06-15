import React from "react";

import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./Theme";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { type User } from "@/types/user";

export const Providers: React.FC<{
  children: React.ReactNode;
  initialUser?: User | null;
}> = ({ children, initialUser }) => {
  return (
    <ThemeProvider>
      <ToastProvider timeout={4000} limit={3}>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  );
};
