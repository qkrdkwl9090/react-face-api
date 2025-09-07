export { faceApiService } from '@/shared/lib/face-api/face-api-service';
export { faceDetectionService } from '@/shared/lib/face-api/face-detection-service';
export { FACE_API_CONFIG, MODEL_NAMES, DEFAULT_MODEL_LOAD_ORDER } from '@/shared/lib/face-api/config';
export type { 
  FaceApiModel, 
  FaceApiConfig, 
  ModelLoadingState, 
  FaceApiService,
  FaceDetectionOptions,
  DetectionStats,
  FaceDetectionResult,
  FaceDetectionService
} from '@/shared/lib/face-api/types';
export * from '@/shared/lib/face-api/types';