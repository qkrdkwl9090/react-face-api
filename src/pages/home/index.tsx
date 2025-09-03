import { FaceDetectionPanel } from '@/widgets/face-detection-panel';

export function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Face API.js Demo
        </h1>
        <p className="text-dark-400 text-lg">
          실시간 얼굴 감지 및 분석 데모 애플리케이션
        </p>
      </header>
      
      <FaceDetectionPanel />
    </main>
  );
}