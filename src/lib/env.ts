// Configuração de variáveis de ambiente tipadas

export const env = {
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

  // Ambiente
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",

  // Upload
  uploadMaxSizeMB: parseInt(process.env.UPLOAD_MAX_SIZE_MB || "10", 10),
} as const;

// Validação de variáveis obrigatórias (apenas em produção)
export function validateEnv() {
  if (env.isProd) {
    const required = ["NEXT_PUBLIC_API_URL"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }
}
