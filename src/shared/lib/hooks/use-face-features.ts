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

export type FeatureType = keyof FaceFeaturesState | 'none';

const INITIAL_FEATURES_STATE: FaceFeaturesState = {
  realTimeDetection: true, // 기본값으로 설정
  landmarks: false,
  expressions: false,
  ageGender: false,
  faceRecognition: false,
};

interface UseFaceFeaturesReturn {
  features: FaceFeature[];
  enabledFeatures: FaceFeaturesState;
  selectedFeature: FeatureType;
  selectFeature: (featureId: FeatureType) => void;
  resetFeatures: () => void;
}

export function useFaceFeatures(): UseFaceFeaturesReturn {
  const [enabledFeatures, setEnabledFeatures] = useState<FaceFeaturesState>(INITIAL_FEATURES_STATE);
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>('realTimeDetection');

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

  // 기능 선택 함수 - 하나만 선택 가능
  const selectFeature = useCallback((featureId: FeatureType) => {
    setSelectedFeature(featureId);
    
    // 실시간 감지는 항상 켜져있고, 추가 기능만 선택적으로 활성화
    const newState: FaceFeaturesState = {
      realTimeDetection: true, // 기본 감지는 항상 활성화
      landmarks: featureId === 'landmarks',
      expressions: featureId === 'expressions', 
      ageGender: featureId === 'ageGender',
      faceRecognition: featureId === 'faceRecognition',
    };
    
    setEnabledFeatures(newState);
  }, []);

  // 모든 기능 리셋
  const resetFeatures = useCallback(() => {
    setSelectedFeature('realTimeDetection');
    setEnabledFeatures(INITIAL_FEATURES_STATE);
  }, []);

  return {
    features,
    enabledFeatures,
    selectedFeature,
    selectFeature,
    resetFeatures,
  };
}