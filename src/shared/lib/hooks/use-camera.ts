import { useState, useRef, useCallback, useEffect } from 'react';

interface CameraDevice {
  deviceId: string;
  label: string;
}

interface CameraState {
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  stream: MediaStream | null;
  devices: CameraDevice[];
  selectedDeviceId: string | null;
  hasPermission: boolean;
}

interface CameraHook extends CameraState {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  startCamera: (deviceId?: string) => Promise<void>;
  captureImage: () => string | null;
  requestPermission: () => Promise<void>;
  selectDevice: (deviceId: string) => Promise<void>;
}

export function useCamera(): CameraHook {
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isLoading: false,
    error: null,
    stream: null,
    devices: [],
    selectedDeviceId: null,
    hasPermission: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      tempStream.getTracks().forEach(track => track.stop());
      
      setState(prev => ({ ...prev, hasPermission: true, error: null }));
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `카메라 ${device.deviceId.substring(0, 8)}`
        }));
      
      setState(prev => ({ 
        ...prev, 
        devices: videoDevices,
        selectedDeviceId: videoDevices[0]?.deviceId || null
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카메라 권한이 필요합니다';
      setState(prev => ({ ...prev, error: errorMessage, hasPermission: false }));
    }
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    const targetDeviceId = deviceId || state.selectedDeviceId;
    if (!targetDeviceId) {
      return;
    }

    if (state.isLoading) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      setState(prev => {
        if (prev.stream) {
          prev.stream.getTracks().forEach(track => track.stop());
        }
        return { ...prev, stream: null };
      });

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { exact: targetDeviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      setState(prev => ({
        ...prev,
        isActive: true,
        isLoading: false,
        error: null,
        stream,
        selectedDeviceId: targetDeviceId
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카메라 시작에 실패했습니다';
      setState(prev => ({
        ...prev,
        isActive: false,
        isLoading: false,
        error: errorMessage,
        stream: null
      }));
    }
  }, [state.isActive, state.isLoading, state.selectedDeviceId, state.stream]);

  const selectDevice = useCallback(async (deviceId: string) => {
    setState(prev => {
      if (prev.stream) {
        prev.stream.getTracks().forEach(track => track.stop());
      }
      
      return { 
        ...prev, 
        selectedDeviceId: deviceId,
        stream: null,
        isActive: false
      };
    });
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    await startCamera(deviceId);
  }, [startCamera]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !state.isActive) return null;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [state.isActive]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (state.hasPermission && state.selectedDeviceId && !state.isActive && !state.isLoading) {
      startCamera(state.selectedDeviceId);
    }
  }, [state.hasPermission, state.selectedDeviceId, state.isActive, state.isLoading, startCamera]);

  useEffect(() => {
    if (state.isActive && state.stream && videoRef.current) {
      videoRef.current.srcObject = null;
      
      setTimeout(() => {
        if (videoRef.current && state.stream) {
          videoRef.current.srcObject = state.stream;
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          };
          
          if (videoRef.current.readyState >= 3) {
            videoRef.current.play().catch(() => {});
          }
        }
      }, 10);
    }
  }, [state.isActive, state.stream?.id]);

  return {
    ...state,
    videoRef,
    startCamera,
    captureImage,
    requestPermission,
    selectDevice,
  };
}