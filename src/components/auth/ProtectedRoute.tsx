"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({
  children,
  requiredRole = "admin",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Verificar se o usuário tem a role necessária
      if (requiredRole === "admin" && user.role !== "admin") {
        setIsRedirecting(true);
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router]);

  // Mostra loading enquanto verifica autenticação ou redireciona
  if (isLoading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-gray-500">
            {isRedirecting ? "Redirecionando..." : "Verificando autenticação..."}
          </p>
        </div>
      </div>
    );
  }

  // Se não autenticado, mostra loading (redirecionamento em andamento)
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-gray-500">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  // Se não tem permissão, mostra loading
  if (requiredRole === "admin" && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-gray-500">Acesso não autorizado...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
