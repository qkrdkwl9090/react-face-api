export interface FaceApiModel {
  name: string;
  url: string;
  loaded: boolean;
}

export interface FaceApiConfig {
  modelPath: string;
  models: {
    ssdMobilenetv1: FaceApiModel;
    faceLandmark68Net: FaceApiModel;
    faceRecognitionNet: FaceApiModel;
    faceExpressionNet: FaceApiModel;
    ageGenderNet: FaceApiModel;
    tinyFaceDetector: FaceApiModel;
  };
}

export interface ModelLoadingState {
  isLoading: boolean;
  loadedModels: string[];
  error: string | null;
  progress: number;
  total: number;
}

export interface FaceApiService {
  loadModels: (modelNames?: string[]) => Promise<void>;
  isModelLoaded: (modelName: string) => boolean;
  getAllLoadedModels: () => string[];
  getLoadingState: () => ModelLoadingState;
}