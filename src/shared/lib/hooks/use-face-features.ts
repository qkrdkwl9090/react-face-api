import { useState, useCallback, useMemo } from 'react';

export interface FaceFeature {
  id: string;
  name: string;
  isEnabled: boolean;
  isAvailable: boolean;
}

export interface FaceFeaturesState {
  realTimeDetection: boolean;
  landmarks: boolean;
  expressions: boolean;
  ageGender: boolean;
  faceRecognition: boolean;
}

const INITIAL_FEATURES_STATE: FaceFeaturesState = {
  realTimeDetection: false,
  landmarks: false,
  expressions: false,
  ageGender: false,
  faceRecognition: false,
};

interface UseFaceFeaturesReturn {
  features: FaceFeature[];
  enabledFeatures: FaceFeaturesState;
  toggleFeature: (featureId: string) => void;
  resetFeatures: () => void;
}

export function useFaceFeatures(): UseFaceFeaturesReturn {
  const [enabledFeatures, setEnabledFeatures] = useState<FaceFeaturesState>(INITIAL_FEATURES_STATE);

  // 기능 목록을 메모이제이션하여 불필요한 리렌더링 방지
  const features = useMemo<FaceFeature[]>(() => [
    {
      id: 'realTimeDetection',
      name: '실시간 얼굴 감지',
      isEnabled: enabledFeatures.realTimeDetection,
      isAvailable: true,
    },
    {
      id: 'landmarks',
      name: '얼굴 특징점 (68점)',
      isEnabled: enabledFeatures.landmarks,
      isAvailable: true,
    },
    {
      id: 'expressions',
      name: '감정 인식',
      isEnabled: enabledFeatures.expressions,
      isAvailable: true,
    },
    {
      id: 'ageGender',
      name: '나이/성별 추정',
      isEnabled: enabledFeatures.ageGender,
      isAvailable: true,
    },
    {
      id: 'faceRecognition',
      name: '얼굴 등록/매칭',
      isEnabled: enabledFeatures.faceRecognition,
      isAvailable: true,
    },
  ], [enabledFeatures]);

  // 기능 토글 함수 - 콜백으로 메모이제이션
  const toggleFeature = useCallback((featureId: string) => {
    setEnabledFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId as keyof FaceFeaturesState],
    }));
  }, []);

  // 모든 기능 리셋
  const resetFeatures = useCallback(() => {
    setEnabledFeatures(INITIAL_FEATURES_STATE);
  }, []);

  return {
    features,
    enabledFeatures,
    toggleFeature,
    resetFeatures,
  };
}