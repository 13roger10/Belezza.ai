"use client";

import { ReactNode } from "react";
import { SalonAuthProvider } from "@/contexts/SalonAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface SalonLayoutProps {
  children: ReactNode;
}

export default function SalonLayout({ children }: SalonLayoutProps) {
  return (
    <ThemeProvider>
      <SalonAuthProvider>
        {children}
      </SalonAuthProvider>
    </ThemeProvider>
  );
}
