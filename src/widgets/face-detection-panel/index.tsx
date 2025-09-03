import { Card, CardHeader, CardContent, Button } from '@/shared/ui/components';

export function FaceDetectionPanel() {
  const features = [
    { name: '실시간 얼굴 감지', status: 'ready' },
    { name: '얼굴 특징점 (68점)', status: 'ready' },
    { name: '감정 인식', status: 'ready' },
    { name: '나이/성별 추정', status: 'ready' },
    { name: '얼굴 등록/매칭', status: 'ready' }
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-8">
          {/* 카메라 영역 */}
          <div className="xl:col-span-2 space-y-6">
            {/* 카메라 프리뷰 */}
            <div className="relative">
              <div className="camera-preview aspect-video flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <div className="w-8 h-8 bg-blue-400/30 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">카메라 대기 중</h3>
                    <p className="text-slate-400 text-sm">카메라를 시작하여 실시간 얼굴 분석을 체험해보세요</p>
                  </div>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-800/70 backdrop-blur-sm rounded-full px-3 py-2">
                <div className="status-dot bg-yellow-400"></div>
                <span className="text-sm text-white font-medium">대기 중</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              <Button size="md">카메라 시작</Button>
              <Button variant="secondary" size="md">설정</Button>
              <Button variant="outline" size="md">이미지 업로드</Button>
            </div>
          </div>

          {/* 사이드 패널 */}
          <div className="space-y-6">
            {/* 실시간 결과 */}
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/60">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">실시간 분석</h3>
                  <div className="status-dot bg-gray-400"></div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">감지된 얼굴</span>
                    <span className="text-2xl font-bold text-white">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">처리 속도</span>
                    <span className="text-sm text-slate-400">- fps</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">정확도</span>
                    <span className="text-sm text-slate-400">--%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 기능 목록 */}
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/60">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">사용 가능한 기능</h3>
              </CardHeader>
              <CardContent className="space-y-1">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="flex-1">
                      <span className="text-slate-200 text-sm font-medium">{feature.name}</span>
                    </div>
                    <div className="status-dot bg-green-400"></div>
                  </div>
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