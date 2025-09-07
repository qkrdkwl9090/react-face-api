import { useState, useCallback, useRef, useEffect } from 'react';
import { faceDetectionService } from '@/shared/lib/face-api';
import type { FaceDetectionOptions, DetectionStats } from '@/shared/lib/face-api';

interface UseFaceDetectionReturn {
  isDetecting: boolean;
  error: string | null;
  stats: DetectionStats;
  startDetection: (video: HTMLVideoElement, options: Partial<FaceDetectionOptions>) => void;
  stopDetection: () => void;
  resetStats: () => void;
}

const initialStats: DetectionStats = {
  averageFPS: 0,
  totalFrames: 0,
  detectedFrames: 0,
};

export function useFaceDetection(): UseFaceDetectionReturn {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DetectionStats>(initialStats);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statsUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 캔버스 생성 및 설정
  const createCanvas = useCallback((video: HTMLVideoElement): HTMLCanvasElement => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.style.position = 'absolute';
      canvasRef.current.style.top = '0';
      canvasRef.current.style.left = '0';
      canvasRef.current.style.width = '100%';
      canvasRef.current.style.height = '100%';
      canvasRef.current.style.pointerEvents = 'none';
      canvasRef.current.style.zIndex = '10';
    }

    const canvas = canvasRef.current;
    
    // 비디오 실제 크기에 맞춰 캔버스 해상도 설정
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;

    // 캔버스를 비디오 부모 요소에 추가
    const videoParent = video.parentElement;
    if (videoParent && !videoParent.contains(canvas)) {
      videoParent.appendChild(canvas);
      // 부모 요소를 relative로 설정
      if (getComputedStyle(videoParent).position === 'static') {
        videoParent.style.position = 'relative';
      }
    }

    return canvas;
  }, []);

  // 통계 업데이트
  const updateStats = useCallback(() => {
    const currentStats = faceDetectionService.getStats();
    setStats(currentStats);
  }, []);

  // 감지 시작
  const startDetection = useCallback((
    video: HTMLVideoElement,
    options: Partial<FaceDetectionOptions>
  ) => {
    try {
      setError(null);
      console.log('🚀 StartDetection called with options:', options);
      
      const modelsLoaded = faceDetectionService.isModelsLoaded();
      console.log('🤖 Models loaded:', modelsLoaded);
      
      if (!modelsLoaded) {
        throw new Error('필요한 모델들이 로드되지 않았습니다.');
      }

      const canvas = createCanvas(video);
      console.log('🎨 Canvas created:', !!canvas);
      
      faceDetectionService.startDetection(video, canvas, options);
      setIsDetecting(true);
      console.log('✅ Detection started successfully');

      // 통계 업데이트 시작 (100ms마다)
      if (statsUpdateIntervalRef.current) {
        clearInterval(statsUpdateIntervalRef.current);
      }
      statsUpdateIntervalRef.current = setInterval(updateStats, 100);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '얼굴 감지 시작 중 오류가 발생했습니다.';
      setError(errorMessage);
    }
  }, [createCanvas, updateStats]);

  // 감지 중지
  const stopDetection = useCallback(() => {
    faceDetectionService.stopDetection();
    setIsDetecting(false);
    
    // 통계 업데이트 중지
    if (statsUpdateIntervalRef.current) {
      clearInterval(statsUpdateIntervalRef.current);
      statsUpdateIntervalRef.current = null;
    }

    // 캔버스 제거
    if (canvasRef.current && canvasRef.current.parentElement) {
      canvasRef.current.parentElement.removeChild(canvasRef.current);
      canvasRef.current = null;
    }
  }, []);

  // 통계 초기화
  const resetStats = useCallback(() => {
    faceDetectionService.resetStats();
    setStats(initialStats);
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isDetecting,
    error,
    stats,
    startDetection,
    stopDetection,
    resetStats,
  };
}