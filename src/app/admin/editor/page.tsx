"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

type EditorTool = "crop" | "filter" | "adjust" | "text" | "draw" | "sticker";

interface Tool {
  id: EditorTool;
  label: string;
  icon: ReactNode;
}

const tools: Tool[] = [
  {
    id: "crop",
    label: "Cortar",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </svg>
    ),
  },
  {
    id: "filter",
    label: "Filtros",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a7 7 0 1 0 7 7" />
      </svg>
    ),
  },
  {
    id: "adjust",
    label: "Ajustes",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <line x1="4" x2="4" y1="21" y2="14" />
        <line x1="4" x2="4" y1="10" y2="3" />
        <line x1="12" x2="12" y1="21" y2="12" />
        <line x1="12" x2="12" y1="8" y2="3" />
        <line x1="20" x2="20" y1="21" y2="16" />
        <line x1="20" x2="20" y1="12" y2="3" />
        <line x1="2" x2="6" y1="14" y2="14" />
        <line x1="10" x2="14" y1="8" y2="8" />
        <line x1="18" x2="22" y1="16" y2="16" />
      </svg>
    ),
  },
  {
    id: "text",
    label: "Texto",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" x2="15" y1="20" y2="20" />
        <line x1="12" x2="12" y1="4" y2="20" />
      </svg>
    ),
  },
  {
    id: "draw",
    label: "Desenhar",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: "sticker",
    label: "Stickers",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" x2="9.01" y1="9" y2="9" />
        <line x1="15" x2="15.01" y1="9" y2="9" />
      </svg>
    ),
  },
];

const filters = [
  { id: "none", label: "Original", class: "" },
  { id: "grayscale", label: "P&B", class: "grayscale" },
  { id: "sepia", label: "Sépia", class: "sepia" },
  { id: "saturate", label: "Vívido", class: "saturate-150" },
  { id: "contrast", label: "Contraste", class: "contrast-125" },
  { id: "brightness", label: "Claro", class: "brightness-110" },
];

export default function EditorPage() {
  const router = useRouter();
  const { warning } = useToast();
  const [imageData, setImageData] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recuperar imagem do sessionStorage
    const storedImage = sessionStorage.getItem("capturedImage");
    if (storedImage) {
      setImageData(storedImage);
    } else {
      warning("Nenhuma imagem", "Selecione uma imagem primeiro");
      router.push("/admin/capture");
    }
    setIsLoading(false);
  }, [router, warning]);

  const handleBack = useCallback(() => {
    router.push("/admin/capture");
  }, [router]);

  const handleContinue = useCallback(() => {
    // Salvar imagem editada e ir para a próxima etapa (gerar texto com IA)
    if (imageData) {
      sessionStorage.setItem("editedImage", imageData);
      router.push("/admin/post/create");
    }
  }, [imageData, router]);

  const handleToolSelect = useCallback((toolId: EditorTool) => {
    setActiveTool((prev) => (prev === toolId ? null : toolId));
  }, []);

  const getCurrentFilterClass = useCallback(() => {
    const filter = filters.find((f) => f.id === selectedFilter);
    return filter?.class || "";
  }, [selectedFilter]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (!imageData) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3">
        <button
          onClick={handleBack}
          className="flex items-center text-white/70 transition-colors hover:text-white"
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          Voltar
        </button>
        <h1 className="text-lg font-semibold text-white">Editar imagem</h1>
        <Button onClick={handleContinue} size="sm">
          Continuar
        </Button>
      </header>

      {/* Área de edição */}
      <div className="relative flex-1 overflow-hidden">
        <div className="flex h-full items-center justify-center p-4">
          <div className="relative max-h-full max-w-full">
            <Image
              src={imageData}
              alt="Imagem para editar"
              width={800}
              height={800}
              className={`max-h-[60vh] w-auto rounded-lg object-contain ${getCurrentFilterClass()}`}
              priority
            />
          </div>
        </div>
      </div>

      {/* Painel de ferramenta ativa */}
      {activeTool === "filter" && (
        <div className="border-t border-gray-800 bg-gray-900 p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex flex-col items-center gap-2 ${
                  selectedFilter === filter.id
                    ? "text-violet-400"
                    : "text-white/70"
                }`}
              >
                <div
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    selectedFilter === filter.id
                      ? "border-violet-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={imageData}
                    alt={filter.label}
                    width={64}
                    height={64}
                    className={`h-full w-full object-cover ${filter.class}`}
                  />
                </div>
                <span className="text-xs">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTool === "adjust" && (
        <div className="border-t border-gray-800 bg-gray-900 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm text-white/70">Brilho</span>
              <input
                type="range"
                min="50"
                max="150"
                defaultValue="100"
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm text-white/70">Contraste</span>
              <input
                type="range"
                min="50"
                max="150"
                defaultValue="100"
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="w-20 text-sm text-white/70">Saturação</span>
              <input
                type="range"
                min="0"
                max="200"
                defaultValue="100"
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {activeTool === "text" && (
        <div className="border-t border-gray-800 bg-gray-900 p-4">
          <div className="text-center text-white/50">
            <p className="text-sm">
              Toque na imagem para adicionar texto
            </p>
            <p className="mt-1 text-xs">
              (Funcionalidade completa em breve)
            </p>
          </div>
        </div>
      )}

      {activeTool === "crop" && (
        <div className="border-t border-gray-800 bg-gray-900 p-4">
          <div className="flex justify-center gap-4">
            {["1:1", "4:5", "16:9", "9:16"].map((ratio) => (
              <button
                key={ratio}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white/70 transition-colors hover:border-violet-500 hover:text-white"
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Barra de ferramentas */}
      <div className="border-t border-gray-800 bg-gray-900 px-2 py-3">
        <div className="flex justify-around">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
                activeTool === tool.id
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tool.icon}
              <span className="text-xs">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
