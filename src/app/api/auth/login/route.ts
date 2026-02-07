import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("[API Login] Received credentials:", { email });

    // Fazer login no backend - NEXT_PUBLIC_ vars não funcionam em API Routes
    const backendUrl = "http://localhost:8080/api";
    console.log("[API Login] Backend URL:", backendUrl);

    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("[API Login] Backend response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("[API Login] Backend error:", error);
      return NextResponse.json(
        { message: "Login failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[API Login] Backend data received:", {
      hasUser: !!data.user,
      hasToken: !!data.accessToken
    });

    // Configurar cookie server-side (garante que funcione)
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: data.accessToken,
      httpOnly: false, // Precisa ser false para o frontend acessar
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 horas
      path: "/",
    });

    console.log("[API Login] Cookie set successfully");

    // Mapear resposta para formato do frontend
    const frontendResponse = {
      user: {
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.nome,
        role: data.user.role === "ADMIN" ? "admin" : "user",
        avatar: undefined,
        createdAt: new Date(data.user.criadoEm),
        updatedAt: new Date(data.user.ultimoLogin || data.user.criadoEm),
      },
      token: data.accessToken,
    };

    console.log("[API Login] Returning frontend response");
    return NextResponse.json(frontendResponse);
  } catch (error) {
    console.error("[API Login] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
