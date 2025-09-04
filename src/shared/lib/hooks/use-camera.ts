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
  stopCamera: () => void;
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
      // First request permission by getting a temporary stream
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      // Immediately stop the temporary stream
      tempStream.getTracks().forEach(track => track.stop());
      
      setState(prev => ({ ...prev, hasPermission: true, error: null }));
      
      // Now get available devices (labels will be available after permission)
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `카메라 ${device.deviceId.substring(0, 8)}`
        }));
      
      console.log('Available cameras:', videoDevices);
      
      setState(prev => ({ 
        ...prev, 
        devices: videoDevices,
        selectedDeviceId: videoDevices[0]?.deviceId || null
      }));
      
    } catch (error) {
      console.error('Camera permission error:', error);
      const errorMessage = error instanceof Error ? error.message : '카메라 권한이 필요합니다';
      setState(prev => ({ ...prev, error: errorMessage, hasPermission: false }));
    }
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    console.log('Starting camera with deviceId:', deviceId);
    
    if (state.isActive || state.isLoading) {
      console.log('Camera already active or loading');
      return;
    }

    const targetDeviceId = deviceId || state.selectedDeviceId;
    if (!targetDeviceId) {
      console.log('No device ID available');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Stop existing stream first
      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { exact: targetDeviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      console.log('Getting user media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got stream:', stream);

      // Update state first to show video element
      setState(prev => ({
        ...prev,
        isActive: true,
        isLoading: false,
        error: null,
        stream,
        selectedDeviceId: targetDeviceId
      }));

      // Then set the video source after state update
      setTimeout(() => {
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          console.log('Set video srcObject');
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, attempting to play');
            if (videoRef.current) {
              videoRef.current.play().catch(playError => {
                console.error('Video play error:', playError);
              });
            }
          };
        }
      }, 100);
      
      console.log('Camera started successfully');
    } catch (error) {
      console.error('Camera start error:', error);
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

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      isLoading: false,
      error: null,
      stream: null
    }));
  }, [state.stream]);

  const selectDevice = useCallback(async (deviceId: string) => {
    setState(prev => ({ ...prev, selectedDeviceId: deviceId }));
    
    if (state.isActive) {
      await startCamera(deviceId);
    }
  }, [state.isActive, startCamera]);

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

  // Auto-request permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Auto-start camera with first device when permission granted
  useEffect(() => {
    if (state.hasPermission && state.selectedDeviceId && !state.isActive && !state.isLoading) {
      startCamera(state.selectedDeviceId);
    }
  }, [state.hasPermission, state.selectedDeviceId, state.isActive, state.isLoading, startCamera]);

  return {
    ...state,
    videoRef,
    startCamera,
    stopCamera,
    captureImage,
    requestPermission,
    selectDevice,
  };
}