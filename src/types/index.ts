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
