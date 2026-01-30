"use client";

import { useEffect, useState } from "react";

export type UploadStatus =
  | "idle"
  | "optimizing"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

interface UploadProgressProps {
  status: UploadStatus;
  progress: number;
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

const statusMessages: Record<UploadStatus, string> = {
  idle: "Aguardando...",
  optimizing: "Otimizando imagem...",
  uploading: "Enviando...",
  processing: "Processando...",
  complete: "Upload concluído!",
  error: "Erro no upload",
};

const statusColors: Record<UploadStatus, string> = {
  idle: "bg-gray-400",
  optimizing: "bg-blue-500",
  uploading: "bg-violet-500",
  processing: "bg-amber-500",
  complete: "bg-green-500",
  error: "bg-red-500",
};

export function UploadProgress({
  status,
  progress,
  error,
  onCancel,
  onRetry,
}: UploadProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Animar a barra de progresso suavemente
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  const isActive = ["optimizing", "uploading", "processing"].includes(status);
  const showCancel = isActive && onCancel;
  const showRetry = status === "error" && onRetry;

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-lg">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Status Icon */}
          {status === "complete" ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : status === "error" ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-4 w-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ) : isActive ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-gray-200" />
          )}

          <span className="text-sm font-medium text-gray-700">
            {statusMessages[status]}
          </span>
        </div>

        {/* Percentage */}
        {isActive && (
          <span className="text-sm font-semibold text-violet-600">
            {Math.round(animatedProgress)}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full transition-all duration-300 ease-out ${statusColors[status]}`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>

      {/* Error Message */}
      {status === "error" && error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Actions */}
      {(showCancel || showRetry) && (
        <div className="mt-3 flex justify-end gap-2">
          {showCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancelar
            </button>
          )}
          {showRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-200"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
