import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que requerem autenticação
const protectedRoutes = ["/admin"];

// Security headers for production
const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Only add security headers in production
  if (process.env.NODE_ENV === "production") {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  return response;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Se for uma rota protegida, verificar autenticação
  if (isProtectedRoute) {
    const token = request.cookies.get("auth_token")?.value;

    // Se não houver token, redirecionar para login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // Se o usuário já estiver autenticado e tentar acessar login, redirecionar para dashboard
  if (pathname === "/login") {
    const token = request.cookies.get("auth_token")?.value;

    if (token) {
      return addSecurityHeaders(NextResponse.redirect(new URL("/admin/dashboard", request.url)));
    }
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.svg$).*)",
  ],
};
