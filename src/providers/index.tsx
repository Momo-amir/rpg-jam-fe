import React from "react";

import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./Theme";
import { ToastProvider, Toaster } from "@/components/ui/toast";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider timeout={4000} limit={3}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  );
};
