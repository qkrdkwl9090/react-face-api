import { Card, CardHeader, CardContent } from '@/shared/ui/components';
import { CameraPreview } from '@/widgets/camera-preview';
import { CameraControls } from '@/features/camera-controls';
import { ModelLoader } from '@/features/model-loader';
import { EmotionDisplay } from '@/widgets/emotion-display';
import { AgeGenderDisplay } from '@/widgets/age-gender-display';
import { FaceRecognition } from '@/widgets/face-recognition';
import { useFaceFeatures, useCamera, useFaceResults, useFaceDetection, useFaceApi } from '@/shared/lib/hooks';
import { useCallback, useEffect } from 'react';

export function FaceDetectionPanel() {
  const { features, selectedFeature, selectFeature, enabledFeatures } = useFaceFeatures();
  const { isActive } = useCamera();
  const { detectedCount, latestEmotion, latestAgeGender } = useFaceResults();
  const { startDetection, stopDetection, isDetecting } = useFaceDetection();
  const { isLoading: modelsLoading } = useFaceApi();

  // 기능 선택 핸들러 - 메모이제이션으로 리렌더링 최적화
  const handleFeatureSelect = useCallback((featureId: string) => {
    selectFeature(featureId as keyof typeof enabledFeatures);
  }, [selectFeature]);

  // 자동 감지 시작 로직
  useEffect(() => {
    // 어떤 기능이든 활성화되어 있고 카메라가 활성화되어 있으면 감지 시작
    const hasActiveFeature = Object.values(enabledFeatures).some(feature => feature);
    
    if (isActive && !modelsLoading && !isDetecting && hasActiveFeature) {
      const video = document.querySelector('video') as HTMLVideoElement;
      
      if (video) {
        const options = {
          detectLandmarks: enabledFeatures.landmarks,
          detectExpressions: enabledFeatures.expressions,
          detectAgeGender: enabledFeatures.ageGender,
          extractDescriptor: enabledFeatures.faceRecognition,
          minConfidence: 0.5,
        };
        
        startDetection(video, options);
      }
    }
  }, [isActive, modelsLoading, isDetecting, startDetection, enabledFeatures, selectedFeature]);

  // 기능 변경시 감지 재시작
  useEffect(() => {
    const hasActiveFeature = Object.values(enabledFeatures).some(feature => feature);
    
    if (isDetecting && isActive && !modelsLoading) {
      stopDetection();
      
      // 활성화된 기능이 있으면 재시작
      if (hasActiveFeature) {
        setTimeout(() => {
          const video = document.querySelector('video') as HTMLVideoElement;
          if (video) {
            const options = {
              detectLandmarks: enabledFeatures.landmarks,
              detectExpressions: enabledFeatures.expressions,
              detectAgeGender: enabledFeatures.ageGender,
              extractDescriptor: enabledFeatures.faceRecognition,
              minConfidence: 0.5,
            };
            
            startDetection(video, options);
          }
        }, 100);
      }
    }
  }, [enabledFeatures, isDetecting, isActive, modelsLoading, stopDetection, startDetection]);

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

            {/* 얼굴 등록/매칭 결과 */}
            {enabledFeatures.faceRecognition && (
              <FaceRecognition />
            )}

            {/* 모델 로더 */}
            <ModelLoader />

            {/* 기능 목록 */}
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/60">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">분석 모드 선택</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.map((feature) => (
                  <label
                    key={feature.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFeature === feature.id
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-slate-700/30 border-slate-600/40 hover:bg-slate-700/50'
                    } ${
                      !feature.isAvailable && 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="faceAnalysisMode"
                      value={feature.id}
                      checked={selectedFeature === feature.id}
                      onChange={() => handleFeatureSelect(feature.id)}
                      disabled={!feature.isAvailable}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedFeature === feature.id
                        ? 'border-blue-400 bg-blue-400'
                        : 'border-slate-400'
                    }`}>
                      {selectedFeature === feature.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      selectedFeature === feature.id ? 'text-blue-200' : 'text-slate-300'
                    }`}>
                      {feature.name}
                    </span>
                  </label>
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