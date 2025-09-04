import { useState, useCallback, useEffect } from 'react';
import type { ModelLoadingState } from '@/shared/lib/face-api/types';
import { faceApiService } from '@/shared/lib/face-api/face-api-service';
import { DEFAULT_MODEL_LOAD_ORDER } from '@/shared/lib/face-api/config';

interface UseFaceApiHook extends ModelLoadingState {
  loadModels: (modelNames?: string[]) => Promise<void>;
  isModelLoaded: (modelName: string) => boolean;
  getAllLoadedModels: () => string[];
}

export function useFaceApi(): UseFaceApiHook {
  const [loadingState, setLoadingState] = useState<ModelLoadingState>(() => 
    faceApiService.getLoadingState()
  );

  const updateLoadingState = useCallback(() => {
    setLoadingState(faceApiService.getLoadingState());
  }, []);

  const loadModels = useCallback(async (modelNames: string[] = DEFAULT_MODEL_LOAD_ORDER) => {
    try {
      updateLoadingState();
      
      // 로딩 상태 업데이트를 위한 폴링
      const pollInterval = setInterval(updateLoadingState, 100);
      
      await faceApiService.loadModels(modelNames);
      
      clearInterval(pollInterval);
      updateLoadingState();
    } catch (error) {
      updateLoadingState();
      throw error;
    }
  }, [updateLoadingState]);

  const isModelLoaded = useCallback((modelName: string): boolean => {
    return faceApiService.isModelLoaded(modelName);
  }, []);

  const getAllLoadedModels = useCallback((): string[] => {
    return faceApiService.getAllLoadedModels();
  }, []);

  useEffect(() => {
    updateLoadingState();
  }, [updateLoadingState]);

  return {
    ...loadingState,
    loadModels,
    isModelLoaded,
    getAllLoadedModels,
  };
}