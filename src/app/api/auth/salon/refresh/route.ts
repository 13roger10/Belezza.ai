import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token é obrigatório" },
        { status: 400 }
      );
    }

    // Em produção, validar o refresh token no banco de dados
    // e gerar novos tokens

    // Mock: retorna erro para forçar re-login
    // Em produção, implementar lógica real de refresh
    return NextResponse.json(
      { message: "Sessão expirada. Faça login novamente." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
