import { useState, useEffect, useCallback } from 'react';
import { faceDetectionService } from '@/shared/lib/face-api';
import type { FaceDetectionResult } from '@/shared/lib/face-api';

interface UseFaceResultsReturn {
  results: FaceDetectionResult[];
  latestResults: FaceDetectionResult[];
  detectedCount: number;
  latestEmotion: any | null;
  latestAgeGender: any | null;
}

export function useFaceResults(): UseFaceResultsReturn {
  const [results, setResults] = useState<FaceDetectionResult[]>([]);

  // 결과 업데이트 콜백
  const handleResults = useCallback((newResults: FaceDetectionResult[]) => {
    setResults(newResults);
  }, []);

  // 서비스에 콜백 등록
  useEffect(() => {
    const unsubscribe = faceDetectionService.onResults(handleResults);
    
    return unsubscribe;
  }, [handleResults]);

  // 계산된 값들
  const detectedCount = results.length;
  const latestEmotion = results.length > 0 ? results[0].expressions : null;
  const latestAgeGender = results.length > 0 ? results[0].ageGender : null;

  return {
    results,
    latestResults: results,
    detectedCount,
    latestEmotion,
    latestAgeGender,
  };
}