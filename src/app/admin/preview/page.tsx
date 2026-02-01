"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { PreviewComparison } from "@/components/preview";
import { postService } from "@/services/post";
import type { UploadResult } from "@/services/upload";

type Platform = "instagram" | "facebook" | "both";

interface PostData {
  imageData: string;
  uploadedImage: UploadResult | null;
  title: string;
  caption: string;
  hashtags: string[];
  platform: Platform;
}

export default function PreviewPage() {
  const router = useRouter();
  const { warning, success, error: showError } = useToast();

  const [postData, setPostData] = useState<PostData | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar dados do post da sessao
  useEffect(() => {
    const storedData = sessionStorage.getItem("previewPostData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPostData(data);
      } catch {
        warning("Erro ao carregar", "Nao foi possivel carregar os dados do post");
        router.push("/admin/post/create");
      }
    } else {
      // Tentar carregar dados individuais como fallback
      const imageData = sessionStorage.getItem("editedImage");
      const captionData = sessionStorage.getItem("generatedCaption");

      if (imageData) {
        let caption = "";
        let hashtags: string[] = [];

        if (captionData) {
          try {
            const parsed = JSON.parse(captionData);
            caption = parsed.text || "";
            hashtags = parsed.hashtags || [];
          } catch {
            // Ignora erro
          }
        }

        setPostData({
          imageData,
          uploadedImage: null,
          title: "",
          caption,
          hashtags,
          platform: "both",
        });
      } else {
        warning("Nenhum post", "Crie um post primeiro");
        router.push("/admin/post/create");
      }
    }
  }, [router, warning]);

  // Voltar para edicao
  const handleBackToEdit = useCallback(() => {
    router.push("/admin/post/create");
  }, [router]);

  // Salvar como rascunho
  const handleSaveDraft = async () => {
    if (!postData) return;

    if (!postData.uploadedImage) {
      warning("Upload pendente", "A imagem ainda nao foi enviada");
      return;
    }

    setIsSaving(true);

    try {
      await postService.createPost({
        imageUrl: postData.uploadedImage.url,
        thumbnailUrl: postData.uploadedImage.thumbnailUrl,
        title: postData.title || "Sem titulo",
        caption: postData.caption,
        hashtags: postData.hashtags,
        platform: postData.platform,
        status: "draft",
      });

      success("Rascunho salvo!", "Seu post foi salvo como rascunho");

      // Limpar session storage
      sessionStorage.removeItem("previewPostData");
      sessionStorage.removeItem("capturedImage");
      sessionStorage.removeItem("editedImage");
      sessionStorage.removeItem("generatedCaption");

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
    if (!postData) return;

    if (!postData.uploadedImage) {
      warning("Upload pendente", "A imagem ainda nao foi enviada");
      return;
    }

    if (!postData.title?.trim()) {
      warning("Titulo obrigatorio", "Volte e adicione um titulo para o post");
      return;
    }

    setIsPublishing(true);

    try {
      const post = await postService.createPost({
        imageUrl: postData.uploadedImage.url,
        thumbnailUrl: postData.uploadedImage.thumbnailUrl,
        title: postData.title,
        caption: postData.caption,
        hashtags: postData.hashtags,
        platform: postData.platform,
        status: "draft",
      });

      await postService.publishPost(post.id);

      success("Publicado!", "Seu post foi publicado com sucesso");

      // Limpar session storage
      sessionStorage.removeItem("previewPostData");
      sessionStorage.removeItem("capturedImage");
      sessionStorage.removeItem("editedImage");
      sessionStorage.removeItem("generatedCaption");

      router.push("/admin/posts");
    } catch (err) {
      showError(
        "Erro ao publicar",
        err instanceof Error ? err.message : "Tente novamente"
      );
    } finally {
      setIsPublishing(false);
    }
  };

  if (!postData) {
    return (
      <AdminLayout title="Preview">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="text-gray-500">Carregando preview...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Preview do Post">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preview do Post</h1>
            <p className="mt-1 text-gray-500">
              Veja como seu post ficara nas redes sociais antes de publicar
            </p>
          </div>

          {/* Post Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
              <span className="text-gray-500">Caracteres:</span>{" "}
              <span className="font-semibold text-gray-900">{postData.caption.length}</span>
            </div>
            <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
              <span className="text-gray-500">Hashtags:</span>{" "}
              <span className="font-semibold text-gray-900">{postData.hashtags.length}</span>
            </div>
            <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
              <span className="text-gray-500">Plataforma:</span>{" "}
              <span className="font-semibold text-gray-900">
                {postData.platform === "both" ? "Instagram + Facebook" : postData.platform === "instagram" ? "Instagram" : "Facebook"}
              </span>
            </div>
          </div>
        </div>

        {/* Post Summary Card */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={postData.imageData}
                alt="Post thumbnail"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {postData.title || "Sem titulo"}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {postData.caption || "Sem legenda"}
              </p>
              {postData.hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {postData.hashtags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700"
                    >
                      #{tag}
                    </span>
                  ))}
                  {postData.hashtags.length > 5 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      +{postData.hashtags.length - 5} mais
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Comparison */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <PreviewComparison
            imageUrl={postData.imageData}
            caption={postData.caption}
            hashtags={postData.hashtags}
            platform={postData.platform}
          />
        </div>

        {/* Warning if no upload */}
        {!postData.uploadedImage && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-semibold text-amber-900">Upload Pendente</h4>
                <p className="mt-1 text-sm text-amber-700">
                  A imagem ainda nao foi enviada para o servidor. Volte para a pagina de criacao para completar o upload antes de publicar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={handleBackToEdit}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Voltar e Editar
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={!postData.uploadedImage || isSaving || isPublishing}
              isLoading={isSaving}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Salvar Rascunho
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!postData.uploadedImage || isSaving || isPublishing}
              isLoading={isPublishing}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Publicar Agora
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
