import { Card, CardHeader, CardContent } from '@/shared/ui/components';
import { CameraPreview } from '@/widgets/camera-preview';
import { CameraControls } from '@/features/camera-controls';
import { FaceDetectionControls } from '@/features/face-detection-controls';
import { ModelLoader } from '@/features/model-loader';
import { EmotionDisplay } from '@/widgets/emotion-display';
import { AgeGenderDisplay } from '@/widgets/age-gender-display';
import { useFaceFeatures, useCamera, useFaceResults } from '@/shared/lib/hooks';
import { useCallback } from 'react';

export function FaceDetectionPanel() {
  const { features, toggleFeature, enabledFeatures } = useFaceFeatures();
  const { videoRef, isActive } = useCamera();
  const { detectedCount, latestEmotion, latestAgeGender } = useFaceResults();

  // 기능 클릭 핸들러 - 메모이제이션으로 리렌더링 최적화
  const handleFeatureClick = useCallback((featureId: string) => {
    toggleFeature(featureId);
  }, [toggleFeature]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-8">
          {/* 카메라 영역 */}
          <div className="xl:col-span-2 space-y-6">
            {/* 카메라 프리뷰 */}
            <CameraPreview />

            {/* Controls */}
            <CameraControls />
            
            {/* Face Detection Controls */}
            <FaceDetectionControls 
              videoElement={videoRef.current} 
              isVideoActive={isActive}
              detectionOptions={{
                detectLandmarks: enabledFeatures.landmarks,
                detectExpressions: enabledFeatures.expressions,
                detectAgeGender: enabledFeatures.ageGender,
                extractDescriptor: enabledFeatures.faceRecognition,
                minConfidence: 0.5,
              }}
            />
          </div>

          {/* 사이드 패널 */}
          <div className="space-y-6">
            {/* 실시간 결과 */}
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/60">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">실시간 분석</h3>
                  <div className={`status-dot ${detectedCount > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">감지된 얼굴</span>
                    <span className="text-2xl font-bold text-white">{detectedCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 감정 분석 결과 */}
            {enabledFeatures.expressions && (
              <EmotionDisplay emotions={latestEmotion} />
            )}

            {/* 나이/성별 분석 결과 */}
            {enabledFeatures.ageGender && (
              <AgeGenderDisplay ageGender={latestAgeGender} />
            )}

            {/* 모델 로더 */}
            <ModelLoader />

            {/* 기능 목록 */}
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/60">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">사용 가능한 기능</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature.id)}
                    disabled={!feature.isAvailable}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      feature.isEnabled
                        ? 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/30'
                        : 'bg-slate-700/30 border-slate-600/40 hover:bg-slate-700/50'
                    } ${
                      feature.isAvailable 
                        ? 'cursor-pointer' 
                        : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        feature.isEnabled ? 'text-blue-200' : 'text-slate-300'
                      }`}>
                        {feature.name}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        feature.isEnabled
                          ? 'bg-blue-400'
                          : feature.isAvailable
                          ? 'bg-slate-400'
                          : 'bg-gray-500'
                      }`} />
                    </div>
                    {feature.isEnabled && (
                      <div className="mt-1 text-xs text-blue-300">
                        활성화됨
                      </div>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* 분석 결과 */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">분석 결과</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-8">
                  <div className="w-12 h-12 mx-auto mb-4 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-600 rounded"></div>
                  </div>
                  <p className="text-sm">카메라를 시작하면<br />분석 결과가 표시됩니다</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}