export function FaceDetectionPanel() {
  return (
    <div className="bg-dark-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">
        얼굴 감지 패널
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-700 rounded-lg p-4 aspect-video flex items-center justify-center">
          <span className="text-dark-400">카메라 영역</span>
        </div>
        <div className="bg-dark-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">감지 결과</h3>
          <div className="text-dark-400 text-sm">
            Face API 초기화 중...
          </div>
        </div>
      </div>
    </div>
  );
}