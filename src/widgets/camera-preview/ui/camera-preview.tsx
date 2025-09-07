import { useCamera } from '@/shared/lib/hooks';
import { memo } from 'react';

interface CameraPreviewProps {
  className?: string;
}

function CameraPreviewComponent({ className = '' }: CameraPreviewProps) {
  const { videoRef, isActive, isLoading, error, hasPermission } = useCamera();

  return (
    <div className={`relative ${className}`}>
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-600/40" style={{minHeight: '400px'}}>
        {isActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            controls={false}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 10
            }}
          />
        )}
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/40 z-5">
            <div className="text-center space-y-4 p-12">
              <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <div className="w-8 h-8 bg-blue-400/30 rounded"></div>
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {error ? '카메라 오류' : isLoading ? '카메라 연결 중...' : hasPermission ? '카메라 준비 중...' : '카메라 권한 요청 중...'}
                </h3>
                <p className="text-slate-400 text-sm">
                  {error ? error : '카메라가 자동으로 시작됩니다'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Indicator */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-800/70 backdrop-blur-sm rounded-full px-3 py-2">
        <div 
          className={`status-dot ${
            isActive ? 'bg-green-400' : isLoading ? 'bg-yellow-400' : 'bg-gray-400'
          }`}
        />
        <span className="text-sm text-white font-medium">
          {isActive ? '활성' : isLoading ? '연결 중' : '대기 중'}
        </span>
      </div>
    </div>
  );
}

export const CameraPreview = memo(CameraPreviewComponent);