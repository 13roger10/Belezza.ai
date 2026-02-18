import { NextRequest, NextResponse } from "next/server";
import { SalonAuthUser, AuthUserRole, AUTH_ROLE_PERMISSIONS, AuthLoginResponse } from "@/types/salon/auth";

// ===== Mock de usuários para desenvolvimento =====
// Em produção, isso viria do backend Java Spring Boot
const MOCK_USERS: Record<string, { password: string; user: Omit<SalonAuthUser, 'permissions'> }> = {
  "admin@belezza.com": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@belezza.com",
      name: "Administrador",
      role: "ADMIN" as AuthUserRole,
      phone: "(11) 99999-9999",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  "recepcionista@belezza.com": {
    password: "recep123",
    user: {
      id: "2",
      email: "recepcionista@belezza.com",
      name: "Maria Recepcionista",
      role: "RECEPCIONIST" as AuthUserRole,
      phone: "(11) 98888-8888",
      unitId: "unit-1",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  "profissional@belezza.com": {
    password: "prof123",
    user: {
      id: "3",
      email: "profissional@belezza.com",
      name: "João Barbeiro",
      role: "PROFESSIONAL" as AuthUserRole,
      phone: "(11) 97777-7777",
      unitId: "unit-1",
      professionalId: "prof-1",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  "cliente@belezza.com": {
    password: "cliente123",
    user: {
      id: "4",
      email: "cliente@belezza.com",
      name: "Carlos Cliente",
      role: "CLIENT" as AuthUserRole,
      phone: "(11) 96666-6666",
      clientId: "client-1",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

// Função para gerar token JWT mock (em produção, usar jose ou jsonwebtoken)
function generateMockToken(user: SalonAuthUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
  };
  // Mock: em produção usar JWT real
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function generateRefreshToken(): string {
  return Buffer.from(
    JSON.stringify({ random: Math.random().toString(36), timestamp: Date.now() })
  ).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca usuário mock
    const mockUser = MOCK_USERS[email.toLowerCase()];

    if (!mockUser) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    if (mockUser.password !== password) {
      return NextResponse.json(
        { message: "Senha incorreta" },
        { status: 401 }
      );
    }

    if (!mockUser.user.isActive) {
      return NextResponse.json(
        { message: "Usuário inativo. Entre em contato com o administrador." },
        { status: 403 }
      );
    }

    // Adiciona permissões baseadas na role
    const userWithPermissions: SalonAuthUser = {
      ...mockUser.user,
      permissions: AUTH_ROLE_PERMISSIONS[mockUser.user.role],
      lastLogin: new Date(),
    };

    const token = generateMockToken(userWithPermissions);
    const refreshToken = generateRefreshToken();

    const response: AuthLoginResponse = {
      user: userWithPermissions,
      token,
      refreshToken,
      expiresIn: 86400, // 24 horas em segundos
    };

    // Cria response com cookie
    const nextResponse = NextResponse.json(response);

    // Define cookie HttpOnly para segurança
    nextResponse.cookies.set("salon_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 24 horas
      path: "/",
    });

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
