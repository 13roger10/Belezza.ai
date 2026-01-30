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

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    } as LoginRequest);

    return response.data;
  },

  async verifyToken(token: string): Promise<boolean> {
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
    const response = await api.get<User>("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async refreshToken(token: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};
