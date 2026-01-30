import { api } from "@/lib/api";
import type { User } from "@/types";

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Credenciais de administrador para desenvolvimento
const ADMIN_CREDENTIALS = {
  email: "admin@socialstudio.com",
  password: "Admin@123",
};

// Usuário mock para desenvolvimento
const MOCK_ADMIN_USER: User = {
  id: "admin-001",
  name: "Administrador",
  email: ADMIN_CREDENTIALS.email,
  role: "admin",
  avatar: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Token mock (em produção seria JWT real)
const generateMockToken = () => {
  const payload = {
    userId: MOCK_ADMIN_USER.id,
    email: MOCK_ADMIN_USER.email,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  };
  return btoa(JSON.stringify(payload));
};

// Verificar se está em modo desenvolvimento
const isDev = process.env.NODE_ENV === "development";

// Função para definir cookie de autenticação
const setAuthCookie = (token: string) => {
  if (typeof document !== "undefined") {
    // Cookie expira em 24 horas
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `auth_token=${token}; path=/; expires=${expires}; SameSite=Lax`;
  }
};

// Função para remover cookie de autenticação
const removeAuthCookie = () => {
  if (typeof document !== "undefined") {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Em desenvolvimento, verificar credenciais mock
    if (isDev) {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const token = generateMockToken();
        setAuthCookie(token);
        return {
          user: MOCK_ADMIN_USER,
          token,
        };
      }

      throw new Error("Credenciais inválidas");
    }

    // Em produção, usar API real
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    } as LoginRequest);

    setAuthCookie(response.data.token);
    return response.data;
  },

  async verifyToken(token: string): Promise<boolean> {
    // Em desenvolvimento, verificar token mock
    if (isDev) {
      try {
        const payload = JSON.parse(atob(token));
        return payload.exp > Date.now();
      } catch {
        return false;
      }
    }

    // Em produção, verificar com API
    try {
      await api.get("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch {
      return false;
    }
  },

  async getProfile(token: string): Promise<User> {
    // Em desenvolvimento, retornar usuário mock
    if (isDev) {
      const isValid = await this.verifyToken(token);
      if (isValid) {
        return MOCK_ADMIN_USER;
      }
      throw new Error("Token inválido");
    }

    // Em produção, buscar da API
    const response = await api.get<User>("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async refreshToken(token: string): Promise<LoginResponse> {
    // Em desenvolvimento, gerar novo token mock
    if (isDev) {
      const isValid = await this.verifyToken(token);
      if (isValid) {
        const newToken = generateMockToken();
        setAuthCookie(newToken);
        return {
          user: MOCK_ADMIN_USER,
          token: newToken,
        };
      }
      throw new Error("Token inválido");
    }

    // Em produção, usar API
    const response = await api.post<LoginResponse>(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAuthCookie(response.data.token);
    return response.data;
  },

  logout() {
    removeAuthCookie();
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  },
};
