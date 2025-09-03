export const APP_CONFIG = {
  FACE_API_MODEL_URL: '/models',
  CAMERA_DEFAULTS: {
    width: 640,
    height: 480,
    facingMode: 'user' as const,
  },
  DETECTION_OPTIONS: {
    scoreThreshold: 0.5,
    inputSize: 512,
    boxColor: '#00ff00',
    lineWidth: 2,
  },
} as const;

export const FACE_API_MODELS = [
  'tiny_face_detector_model',
  'face_landmark_68_model',
  'face_recognition_model', 
  'face_expression_model',
  'age_gender_model',
] as const;