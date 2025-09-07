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

export interface FaceDetectionOptions {
  detectLandmarks: boolean;
  detectExpressions: boolean;
  detectAgeGender: boolean;
  extractDescriptor: boolean;
  minConfidence: number;
}

export interface DetectionStats {
  averageFPS: number;
  totalFrames: number;
  detectedFrames: number;
}

export interface FaceDetectionResult {
  detection: any;
  landmarks?: any;
  expressions?: any;
  ageGender?: any;
  descriptor?: Float32Array;
}

export interface FaceDetectionService {
  startDetection: (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    options: Partial<FaceDetectionOptions>
  ) => void;
  stopDetection: () => void;
  isDetecting: () => boolean;
  isModelsLoaded: () => boolean;
  getStats: () => DetectionStats;
  resetStats: () => void;
  onResults: (callback: (results: FaceDetectionResult[]) => void) => () => void;
  getLatestResults: () => FaceDetectionResult[];
}