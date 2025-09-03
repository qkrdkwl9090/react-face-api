export interface FaceDetectionResult {
  detection: {
    box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    score: number;
  };
  landmarks?: Array<{ x: number; y: number }>;
  expressions?: Record<string, number>;
  ageAndGender?: {
    age: number;
    gender: string;
    genderProbability: number;
  };
  descriptor?: Float32Array;
}

export interface CameraSettings {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

export interface ModelLoadingState {
  isLoading: boolean;
  loadedModels: string[];
  error?: string;
}