"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}
