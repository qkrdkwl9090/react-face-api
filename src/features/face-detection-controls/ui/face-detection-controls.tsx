import { Button } from '@/shared/ui/components';
import { useFaceDetection, useFaceApi } from '@/shared/lib/hooks';
import { faceDetectionService } from '@/shared/lib/face-api';
import type { FaceDetectionOptions } from '@/shared/lib/face-api';

interface FaceDetectionControlsProps {
  videoElement: HTMLVideoElement | null;
  isVideoActive: boolean;
  detectionOptions?: Partial<FaceDetectionOptions>;
  className?: string;
}

export function FaceDetectionControls({ 
  videoElement, 
  isVideoActive,
  detectionOptions = {},
  className = '' 
}: FaceDetectionControlsProps) {
  const { 
    isDetecting, 
    error, 
    stats, 
    startDetection, 
    stopDetection, 
    resetStats 
  } = useFaceDetection();
  
  const { isLoading: modelsLoading } = useFaceApi();
  
  // 모델이 준비되었는지 확인 (Face API 네트워크 직접 확인)
  const isModelsReady = faceDetectionService.isModelsLoaded() && !modelsLoading;

  const handleToggleDetection = () => {
    // 비디오 엘리먼트 확보 (props에서 전달받지 못했다면 DOM에서 직접 찾기)
    const video = videoElement || document.querySelector('video');
    
    if (!video || !isVideoActive) {
      return;
    }

    if (!isModelsReady) {
      return;
    }

    if (isDetecting) {
      stopDetection();
    } else {
      // 동적 옵션을 기본값과 병합
      const options: Partial<FaceDetectionOptions> = {
        detectLandmarks: true,
        detectExpressions: true,
        detectAgeGender: true,
        extractDescriptor: false,
        minConfidence: 0.5,
        ...detectionOptions, // 전달받은 옵션으로 오버라이드
      };
      
      startDetection(video as HTMLVideoElement, options);
    }
  };

  const handleResetStats = () => {
    resetStats();
  };

  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">얼굴 감지</h4>
          <div className={`status-dot ${isDetecting ? 'bg-green-400' : 'bg-gray-400'}`} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={handleToggleDetection}
            disabled={!isVideoActive || !isModelsReady}
            className={isDetecting ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {modelsLoading ? '모델 로딩 중...' : 
             !isModelsReady ? '모델 필요' :
             !isVideoActive ? '카메라 필요' :
             isDetecting ? '감지 정지' : '감지 시작'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetStats}
            disabled={!videoElement}
          >
            통계 초기화
          </Button>
        </div>

        {error && (
          <div className="text-red-400 text-xs bg-red-900/20 rounded px-2 py-1">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400">처리 속도</span>
            <div className="text-white font-medium">
              {stats.averageFPS.toFixed(1)} FPS
            </div>
          </div>
          <div>
            <span className="text-slate-400">감지 성공률</span>
            <div className="text-white font-medium">
              {stats.totalFrames > 0 
                ? Math.round((stats.detectedFrames / stats.totalFrames) * 100)
                : 0}%
            </div>
          </div>
          <div>
            <span className="text-slate-400">총 프레임</span>
            <div className="text-white font-medium">{stats.totalFrames}</div>
          </div>
          <div>
            <span className="text-slate-400">감지 프레임</span>
            <div className="text-white font-medium">{stats.detectedFrames}</div>
          </div>
        </div>
      </div>
    </div>
  );
}