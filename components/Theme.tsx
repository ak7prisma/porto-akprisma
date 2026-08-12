"use client";

import { ThemeProvider } from "next-themes";

export function Theme({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
