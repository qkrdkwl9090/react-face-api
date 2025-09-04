import type { FaceApiConfig } from '@/shared/lib/face-api/types';

export const FACE_API_CONFIG: FaceApiConfig = {
  modelPath: '/models',
  models: {
    ssdMobilenetv1: {
      name: 'ssdMobilenetv1',
      url: '/models',
      loaded: false,
    },
    faceLandmark68Net: {
      name: 'faceLandmark68Net',
      url: '/models',
      loaded: false,
    },
    faceRecognitionNet: {
      name: 'faceRecognitionNet',
      url: '/models',
      loaded: false,
    },
    faceExpressionNet: {
      name: 'faceExpressionNet',
      url: '/models',
      loaded: false,
    },
    ageGenderNet: {
      name: 'ageGenderNet',
      url: '/models',
      loaded: false,
    },
    tinyFaceDetector: {
      name: 'tinyFaceDetector',
      url: '/models',
      loaded: false,
    },
  },
};

export const MODEL_NAMES = Object.keys(FACE_API_CONFIG.models) as Array<keyof typeof FACE_API_CONFIG.models>;

export const DEFAULT_MODEL_LOAD_ORDER: string[] = [
  'ssdMobilenetv1',
  'faceLandmark68Net',
  'faceRecognitionNet',
  'faceExpressionNet',
  'ageGenderNet',
];