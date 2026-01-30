"use client";

import Image from "next/image";
import { Button } from "@/components/ui";

interface ImagePreviewProps {
  imageData: string;
  onConfirm: () => void;
  onRetake: () => void;
  onCancel: () => void;
}

export function ImagePreview({
  imageData,
  onConfirm,
  onRetake,
  onCancel,
}: ImagePreviewProps) {
  return (
    <div className="flex h-full flex-col bg-black">
      {/* Área da imagem */}
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={imageData}
          alt="Preview da imagem"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Controles */}
      <div className="bg-gradient-to-t from-black/90 to-black/50 p-6">
        <div className="mx-auto max-w-md space-y-4">
          {/* Botão principal */}
          <Button
            onClick={onConfirm}
            fullWidth
            className="h-14 text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-5 w-5"
            >
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            Editar imagem
          </Button>

          {/* Botões secundários */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onRetake}
              fullWidth
              className="border-white/30 text-white hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Nova foto
            </Button>

            <Button
              variant="ghost"
              onClick={onCancel}
              fullWidth
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
