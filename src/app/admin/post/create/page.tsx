"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminLayout } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { UploadProgress } from "@/components/upload";
import { useUpload } from "@/hooks/useUpload";
import { postService } from "@/services/post";
import type { UploadResult } from "@/services/upload";

type Platform = "instagram" | "facebook" | "both";

export default function CreatePostPage() {
  const router = useRouter();
  const { warning, success, error: showError } = useToast();

  // Estados da imagem
  const [imageData, setImageData] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadResult | null>(null);

  // Hook de upload
  const {
    phase: uploadStatus,
    progress: uploadProgress,
    error: uploadError,
    result: uploadResult,
    fileName,
    fileSize,
    estimatedTimeRemaining,
    upload,
    cancel,
    reset: resetUpload,
    retry,
    isUploading,
    isComplete: isUploadComplete,
    isError: isUploadError,
    isIdle: isUploadIdle,
  } = useUpload({
    maxWidth: 1080,
    maxHeight: 1080,
    quality: 0.9,
    autoOptimize: true,
    onComplete: (result) => {
      setUploadedImage(result);
      success("Upload concluido!", "Imagem enviada com sucesso");
    },
    onError: (err) => {
      showError("Erro no upload", err.message || "Nao foi possivel enviar a imagem");
    },
  });

  // Estados do formulario
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState<Platform>("both");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar imagem da sessao
  useEffect(() => {
    const storedImage = sessionStorage.getItem("editedImage");
    if (storedImage) {
      setImageData(storedImage);
    } else {
      warning("Nenhuma imagem", "Selecione e edite uma imagem primeiro");
      router.push("/admin/capture");
    }
  }, [router, warning]);

  // Iniciar upload quando a imagem for carregada
  useEffect(() => {
    if (imageData && isUploadIdle) {
      upload(imageData);
    }
  }, [imageData, isUploadIdle, upload]);

  // Atualizar uploadedImage quando o resultado chegar
  useEffect(() => {
    if (uploadResult) {
      setUploadedImage(uploadResult);
    }
  }, [uploadResult]);

  // Funcao de retry
  const handleRetry = useCallback(() => {
    if (imageData) {
      retry(imageData);
    }
  }, [imageData, retry]);

  // Gerar legenda com IA (mock)
  const handleGenerateCaption = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCaption(
      "Transforme seu dia com criatividade!\n\nCada momento e uma oportunidade de criar algo incrivel."
    );
    setHashtags("#creativity #socialstudio #ia #design #art");
    setIsGenerating(false);
    success("Legenda gerada!", "A IA criou uma sugestao de legenda");
  };

  // Extrair hashtags do texto
  const parseHashtags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map((tag) => tag.substring(1)) : [];
  };

  // Salvar rascunho
  const handleSaveDraft = async () => {
    if (!uploadedImage) {
      warning("Aguarde", "O upload da imagem ainda nao foi concluido");
      return;
    }

    setIsSaving(true);

    try {
      await postService.createPost({
        imageUrl: uploadedImage.url,
        thumbnailUrl: uploadedImage.thumbnailUrl,
        title: title || "Sem titulo",
        caption,
        hashtags: parseHashtags(hashtags),
        platform,
        status: "draft",
      });

      success("Rascunho salvo!", "Seu post foi salvo como rascunho");
      sessionStorage.removeItem("capturedImage");
      sessionStorage.removeItem("editedImage");
      router.push("/admin/posts");
    } catch (err) {
      showError(
        "Erro ao salvar",
        err instanceof Error ? err.message : "Tente novamente"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Publicar post
  const handlePublish = async () => {
    if (!uploadedImage) {
      warning("Aguarde", "O upload da imagem ainda nao foi concluido");
      return;
    }

    if (!title.trim()) {
      warning("Titulo obrigatorio", "Adicione um titulo para o post");
      return;
    }

    setIsSaving(true);

    try {
      const post = await postService.createPost({
        imageUrl: uploadedImage.url,
        thumbnailUrl: uploadedImage.thumbnailUrl,
        title,
        caption,
        hashtags: parseHashtags(hashtags),
        platform,
        status: "draft",
      });

      await postService.publishPost(post.id);

      success("Publicado!", "Seu post foi publicado com sucesso");
      sessionStorage.removeItem("capturedImage");
      sessionStorage.removeItem("editedImage");
      router.push("/admin/posts");
    } catch (err) {
      showError(
        "Erro ao publicar",
        err instanceof Error ? err.message : "Tente novamente"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!imageData) {
    return null;
  }

  const canSave = isUploadComplete && !isSaving;

  return (
    <AdminLayout title="Criar Publicacao">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Preview da imagem */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="relative aspect-square w-full">
            <Image
              src={imageData}
              alt="Imagem do post"
              fill
              className="object-cover"
            />

            {/* Overlay de upload */}
            {!isUploadComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-3/4 max-w-xs">
                  <UploadProgress
                    status={uploadStatus}
                    progress={uploadProgress}
                    error={uploadError || undefined}
                    fileName={fileName || undefined}
                    fileSize={fileSize}
                    estimatedTime={estimatedTimeRemaining}
                    onRetry={handleRetry}
                    onCancel={cancel}
                    variant="overlay"
                  />
                </div>
              </div>
            )}

            {/* Badge de sucesso */}
            {isUploadComplete && (
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Enviado
              </div>
            )}
          </div>

          {/* Info da imagem */}
          {uploadedImage && (
            <div className="border-t border-gray-100 px-4 py-2">
              <p className="text-xs text-gray-500">
                {uploadedImage.width} x {uploadedImage.height} px |{" "}
                {(uploadedImage.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}
        </div>

        {/* Titulo */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <label className="mb-2 block font-semibold text-gray-900">
            Titulo
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite um titulo para seu post..."
            maxLength={100}
          />
          <p className="mt-1 text-right text-xs text-gray-500">
            {title.length}/100
          </p>
        </div>

        {/* Legenda */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <label className="font-semibold text-gray-900">Legenda</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateCaption}
              isLoading={isGenerating}
              disabled={isGenerating}
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
                <path d="M12 3v6" />
                <circle cx="12" cy="12" r="1" />
                <path d="M17.5 17.5 12 12" />
                <path d="M6.5 17.5 12 12" />
                <path d="M3 12h6" />
                <path d="M15 12h6" />
              </svg>
              {isGenerating ? "Gerando..." : "Gerar com IA"}
            </Button>
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escreva uma legenda para seu post ou use a IA para gerar..."
            className="min-h-[120px] w-full resize-none rounded-lg border border-gray-200 p-3 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            maxLength={2200}
          />
          <p className="mt-1 text-right text-xs text-gray-500">
            {caption.length}/2200
          </p>
        </div>

        {/* Hashtags */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <label className="mb-2 block font-semibold text-gray-900">
            Hashtags
          </label>
          <Input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#exemplo #hashtag #socialmedia"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separe as hashtags com espacos
          </p>
        </div>

        {/* Plataforma */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <label className="mb-3 block font-semibold text-gray-900">
            Publicar em
          </label>
          <div className="flex gap-2">
            {[
              { value: "instagram" as Platform, label: "Instagram", icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              )},
              { value: "facebook" as Platform, label: "Facebook", icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )},
              { value: "both" as Platform, label: "Ambos", icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              )},
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPlatform(option.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  platform === option.value
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Acoes */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={handleSaveDraft}
            disabled={!canSave}
            isLoading={isSaving}
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
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
              <path d="M7 3v4a1 1 0 0 0 1 1h7" />
            </svg>
            Salvar rascunho
          </Button>
          <Button
            fullWidth
            onClick={handlePublish}
            disabled={!canSave}
            isLoading={isSaving}
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            Publicar agora
          </Button>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
          <p className="text-sm text-violet-700">
            <strong>Dica:</strong> Use a geracao por IA para criar legendas
            otimizadas para engajamento nas redes sociais.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
