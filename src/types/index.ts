// Types e interfaces globais do projeto Social Studio IA

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  title: string;
  caption: string;
  hashtags: string[];
  platform: 'instagram' | 'facebook' | 'both';
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageProcessingOptions {
  enhanceQuality: boolean;
  removeBackground: boolean;
  adjustLighting: boolean;
  filters?: string[];
}

export interface TextGenerationContext {
  serviceType: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'fun' | 'elegant';
  keywords?: string[];
}

export interface GeneratedText {
  title: string;
  caption: string;
  hashtags: string[];
}

export type SocialPlatform = 'instagram' | 'facebook';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

// ===== AI Image Editing Types (Fase 7) =====

export type AIProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

export interface AIProcessingState {
  status: AIProcessingStatus;
  progress: number;
  message?: string;
  error?: string;
}

export interface AIEnhancementOptions {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  upscale: boolean;
  upscaleFactor: 1 | 2 | 4;
  denoise: boolean;
  denoiseStrength: number;
  sharpen: boolean;
  sharpenStrength: number;
  autoColor: boolean;
  autoContrast: boolean;
}

export interface AIBackgroundOptions {
  mode: 'remove' | 'blur' | 'replace';
  blurStrength?: number;
  replacementColor?: string;
  replacementImage?: string;
}

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ObjectDetectionResult {
  objects: DetectedObject[];
  processingTime: number;
}

export interface AIImageResult {
  imageData: string;
  originalSize: { width: number; height: number };
  processedSize: { width: number; height: number };
  processingTime: number;
  appliedEffects: string[];
}

export interface EditingHistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  imageData: string;
  metadata?: Record<string, unknown>;
}

export interface EditorState {
  originalImage: string;
  currentImage: string;
  history: EditingHistoryEntry[];
  historyIndex: number;
  selectedTool: EditorTool;
  aiProcessing: AIProcessingState;
  detectedObjects: DetectedObject[];
  zoom: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

export type EditorTool =
  | 'select'
  | 'crop'
  | 'filter'
  | 'adjust'
  | 'text'
  | 'draw'
  | 'sticker'
  | 'ai-enhance'
  | 'ai-background'
  | 'ai-objects'
  | 'ai-generate';

export interface AIGenerativeOptions {
  prompt: string;
  style: 'realistic' | 'artistic' | 'cartoon' | 'sketch';
  strength: number;
  preserveOriginal: boolean;
}

export interface AICaptionResult {
  caption: string;
  hashtags: string[];
  alternativeCaptions: string[];
  tone: string;
  language: string;
}

// ===== Manual Editing Types (Fase 8) =====

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AspectRatio {
  label: string;
  value: number | null; // null = free aspect ratio
}

export interface TextOverlayConfig {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  backgroundColor?: string;
  rotation: number;
  opacity: number;
  textAlign: 'left' | 'center' | 'right';
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  tool: 'pen' | 'brush' | 'eraser' | 'highlighter';
}

export interface Sticker {
  id: string;
  src: string;
  name: string;
  category: string;
}

export interface StickerOverlay {
  id: string;
  stickerId: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  flipH: boolean;
  flipV: boolean;
}

export interface ManualEditingState {
  cropArea: CropArea | null;
  selectedAspectRatio: AspectRatio | null;
  textOverlays: TextOverlayConfig[];
  selectedTextId: string | null;
  drawingPaths: DrawingPath[];
  currentDrawingPath: DrawingPath | null;
  stickerOverlays: StickerOverlay[];
  selectedStickerId: string | null;
}
