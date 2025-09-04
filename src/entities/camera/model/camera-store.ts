import { createContext, useContext } from 'react';

export interface CameraSettings {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
  frameRate: number;
}

export interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  stream: MediaStream | null;
  settings: CameraSettings;
}

export interface CameraActions {
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  updateSettings: (settings: Partial<CameraSettings>) => void;
  clearError: () => void;
}

export type CameraContextType = CameraState & CameraActions;

export const CameraContext = createContext<CameraContextType | null>(null);

export function useCameraContext(): CameraContextType {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext must be used within CameraProvider');
  }
  return context;
}