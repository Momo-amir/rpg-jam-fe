import React from "react";

import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./Theme";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
