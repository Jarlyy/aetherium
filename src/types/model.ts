// Типы для 3D моделей
export interface Model3D {
  id: string;
  title: string;
  prompt: string;
  author?: string;
  fileUrl?: string;
  previewImageUrl?: string;
  isPublic: boolean;
  likes: number;
  downloads: number;
  fileSize?: string;
  formats: string[];
  createdAt: string;
  updatedAt: string;
}

// Типы для API ответов
export interface GenerationResponse {
  success: boolean;
  data?: {
    modelId: string;
    fileUrl: string;
    previewUrl?: string;
  };
  error?: string;
  progress?: number;
}

// Типы для Hugging Face API
export interface HuggingFaceResponse {
  generated_text?: string;
  image?: Blob;
  model_file?: Blob;
  error?: string;
}

// Типы для генерации
export interface GenerationRequest {
  prompt: string;
  style?: string;
  quality?: string;
}

export interface GenerationStatus {
  status: 'idle' | 'generating' | 'completed' | 'error';
  progress: number;
  message?: string;
  modelId?: string;
}