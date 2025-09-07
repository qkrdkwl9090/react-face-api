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

export interface RegisteredFace {
  id: string;
  name: string;
  descriptor: Float32Array;
  createdAt: Date;
}

export interface FaceMatch {
  registeredFace: RegisteredFace;
  distance: number;
  confidence: number;
}

export interface FaceRecognitionOptions {
  threshold: number; // 매칭 임계값 (기본값: 0.6)
  maxResults: number; // 최대 매칭 결과 수
}

export interface FaceRecognitionService {
  registerFace: (name: string, descriptor: Float32Array) => string;
  deleteFace: (faceId: string) => boolean;
  findMatches: (descriptor: Float32Array, options?: Partial<FaceRecognitionOptions>) => FaceMatch[];
  getAllRegisteredFaces: () => RegisteredFace[];
  clearAllFaces: () => void;
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