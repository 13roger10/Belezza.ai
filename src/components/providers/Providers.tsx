"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider position="top-right">{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
