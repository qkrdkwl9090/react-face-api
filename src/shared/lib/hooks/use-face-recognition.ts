import { useState, useCallback, useEffect } from 'react';
import { faceRecognitionService } from '@/shared/lib/face-api/face-recognition-service';
import type { RegisteredFace, FaceMatch, FaceRecognitionOptions } from '@/shared/lib/face-api/types';

interface UseFaceRecognitionReturn {
  registeredFaces: RegisteredFace[];
  registerFace: (name: string, descriptor: Float32Array) => string | null;
  deleteFace: (faceId: string) => boolean;
  findMatches: (descriptor: Float32Array, options?: Partial<FaceRecognitionOptions>) => FaceMatch[];
  clearAllFaces: () => void;
  isRegistering: boolean;
  error: string | null;
}

export function useFaceRecognition(): UseFaceRecognitionReturn {
  const [registeredFaces, setRegisteredFaces] = useState<RegisteredFace[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 등록된 얼굴 목록 로드
  const loadRegisteredFaces = useCallback(() => {
    try {
      const faces = faceRecognitionService.getAllRegisteredFaces();
      setRegisteredFaces(faces);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '등록된 얼굴 로드 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  }, []);

  // 새 얼굴 등록
  const registerFace = useCallback((name: string, descriptor: Float32Array): string | null => {
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return null;
    }

    try {
      setIsRegistering(true);
      setError(null);

      const faceId = faceRecognitionService.registerFace(name, descriptor);
      loadRegisteredFaces(); // 등록 후 목록 새로고침
      
      return faceId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '얼굴 등록 중 오류가 발생했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setIsRegistering(false);
    }
  }, [loadRegisteredFaces]);

  // 얼굴 삭제
  const deleteFace = useCallback((faceId: string): boolean => {
    try {
      setError(null);
      const success = faceRecognitionService.deleteFace(faceId);
      
      if (success) {
        loadRegisteredFaces(); // 삭제 후 목록 새로고침
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '얼굴 삭제 중 오류가 발생했습니다.';
      setError(errorMessage);
      return false;
    }
  }, [loadRegisteredFaces]);

  // 얼굴 매칭 검색
  const findMatches = useCallback((
    descriptor: Float32Array, 
    options?: Partial<FaceRecognitionOptions>
  ): FaceMatch[] => {
    try {
      setError(null);
      return faceRecognitionService.findMatches(descriptor, options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '얼굴 매칭 중 오류가 발생했습니다.';
      setError(errorMessage);
      return [];
    }
  }, []);

  // 모든 얼굴 삭제
  const clearAllFaces = useCallback(() => {
    try {
      setError(null);
      faceRecognitionService.clearAllFaces();
      loadRegisteredFaces(); // 삭제 후 목록 새로고침
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '모든 얼굴 삭제 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  }, [loadRegisteredFaces]);

  // 초기 로드
  useEffect(() => {
    loadRegisteredFaces();
  }, [loadRegisteredFaces]);

  return {
    registeredFaces,
    registerFace,
    deleteFace,
    findMatches,
    clearAllFaces,
    isRegistering,
    error
  };
}