"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminLayout } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { UploadProgress, UploadStatus } from "@/components/upload";
import { uploadService, UploadResult } from "@/services/upload";
import { postService } from "@/services/post";

type Platform = "instagram" | "facebook" | "both";

export default function CreatePostPage() {
  const router = useRouter();
  const { warning, success, error: showError } = useToast();

  // Estados da imagem
  const [imageData, setImageData] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | undefined>();

  // Estados do formulário
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState<Platform>("both");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar imagem da sessão
  useEffect(() => {
    const storedImage = sessionStorage.getItem("editedImage");
    if (storedImage) {
      setImageData(storedImage);
    } else {
      warning("Nenhuma imagem", "Selecione e edite uma imagem primeiro");
      router.push("/admin/capture");
    }
  }, [router, warning]);

  // Função de upload
  const handleUpload = useCallback(async () => {
    if (!imageData) return;

    setUploadStatus("optimizing");
    setUploadProgress(0);
    setUploadError(undefined);

    try {
      setUploadStatus("uploading");

      const result = await uploadService.uploadImage(imageData, {
        onProgress: (progress) => {
          setUploadProgress(progress.percentage);
        },
        optimize: true,
        maxWidth: 1080,
        maxHeight: 1080,
        quality: 0.9,
      });

      setUploadStatus("complete");
      setUploadProgress(100);
      setUploadedImage(result);
      success("Upload concluído!", "Imagem enviada com sucesso");
    } catch (err) {
      setUploadStatus("error");
      setUploadError(err instanceof Error ? err.message : "Erro no upload");
      showError("Erro no upload", "Não foi possível enviar a imagem");
    }
  }, [imageData, success, showError]);

  // Iniciar upload automaticamente quando a imagem é carregada
  useEffect(() => {
    if (imageData && uploadStatus === "idle") {
      handleUpload();
    }
  }, [imageData, uploadStatus, handleUpload]);

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

  const isUploadComplete = uploadStatus === "complete";
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
                    error={uploadError}
                    onRetry={handleUpload}
                  />
                </div>
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
              { value: "instagram" as Platform, label: "Instagram" },
              { value: "facebook" as Platform, label: "Facebook" },
              { value: "both" as Platform, label: "Ambos" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPlatform(option.value)}
                className={`flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                  platform === option.value
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
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
