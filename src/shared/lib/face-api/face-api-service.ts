import * as faceapi from 'face-api.js';
import type { FaceApiService, ModelLoadingState } from '@/shared/lib/face-api/types';
import { FACE_API_CONFIG, DEFAULT_MODEL_LOAD_ORDER } from '@/shared/lib/face-api/config';

class FaceApiServiceImpl implements FaceApiService {
  private loadingState: ModelLoadingState = {
    isLoading: false,
    loadedModels: [],
    error: null,
    progress: 0,
    total: 0,
  };

  private modelLoaders = {
    ssdMobilenetv1: () => faceapi.nets.ssdMobilenetv1.loadFromUri(FACE_API_CONFIG.modelPath),
    faceLandmark68Net: () => faceapi.nets.faceLandmark68Net.loadFromUri(FACE_API_CONFIG.modelPath),
    faceRecognitionNet: () => faceapi.nets.faceRecognitionNet.loadFromUri(FACE_API_CONFIG.modelPath),
    faceExpressionNet: () => faceapi.nets.faceExpressionNet.loadFromUri(FACE_API_CONFIG.modelPath),
    ageGenderNet: () => faceapi.nets.ageGenderNet.loadFromUri(FACE_API_CONFIG.modelPath),
    tinyFaceDetector: () => faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_CONFIG.modelPath),
  };

  async loadModels(modelNames: string[] = DEFAULT_MODEL_LOAD_ORDER): Promise<void> {
    if (this.loadingState.isLoading) {
      throw new Error('Models are already being loaded');
    }

    this.loadingState = {
      isLoading: true,
      loadedModels: [...this.loadingState.loadedModels],
      error: null,
      progress: 0,
      total: modelNames.length,
    };

    try {
      for (let i = 0; i < modelNames.length; i++) {
        const modelName = modelNames[i];
        
        if (this.isModelLoaded(modelName)) {
          this.loadingState.progress = i + 1;
          continue;
        }

        const loader = this.modelLoaders[modelName as keyof typeof this.modelLoaders];
        if (!loader) {
          throw new Error(`Unknown model: ${modelName}`);
        }

        await loader();
        this.loadingState.loadedModels.push(modelName);
        this.loadingState.progress = i + 1;
      }

      this.loadingState.isLoading = false;
    } catch (error) {
      this.loadingState.isLoading = false;
      this.loadingState.error = error instanceof Error ? error.message : 'Failed to load models';
      throw error;
    }
  }

  isModelLoaded(modelName: string): boolean {
    switch (modelName) {
      case 'ssdMobilenetv1':
        return faceapi.nets.ssdMobilenetv1.isLoaded;
      case 'faceLandmark68Net':
        return faceapi.nets.faceLandmark68Net.isLoaded;
      case 'faceRecognitionNet':
        return faceapi.nets.faceRecognitionNet.isLoaded;
      case 'faceExpressionNet':
        return faceapi.nets.faceExpressionNet.isLoaded;
      case 'ageGenderNet':
        return faceapi.nets.ageGenderNet.isLoaded;
      case 'tinyFaceDetector':
        return faceapi.nets.tinyFaceDetector.isLoaded;
      default:
        return false;
    }
  }

  getAllLoadedModels(): string[] {
    return this.loadingState.loadedModels;
  }

  getLoadingState(): ModelLoadingState {
    return { ...this.loadingState };
  }
}

export const faceApiService = new FaceApiServiceImpl();