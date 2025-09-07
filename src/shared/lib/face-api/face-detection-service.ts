import * as faceapi from 'face-api.js';
import type { 
  FaceDetectionService, 
  FaceDetectionOptions, 
  DetectionStats,
  FaceDetectionResult 
} from '@/shared/lib/face-api/types';

class FaceDetectionServiceImpl implements FaceDetectionService {
  private isRunning = false;
  private animationId: number | null = null;
  private stats: DetectionStats = {
    averageFPS: 0,
    totalFrames: 0,
    detectedFrames: 0,
  };
  private frameStartTime = 0;
  private frameTimes: number[] = [];
  private maxFrameTimes = 30; // FPS 계산을 위한 최근 프레임 수
  private latestResults: FaceDetectionResult[] = [];
  private resultCallbacks: ((results: FaceDetectionResult[]) => void)[] = [];

  startDetection(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    options: Partial<FaceDetectionOptions>
  ): void {
    if (this.isRunning) {
      this.stopDetection();
    }

    if (!this.isModelsLoaded()) {
      throw new Error('필수 모델들이 로드되지 않았습니다.');
    }

    this.isRunning = true;
    this.frameStartTime = performance.now();

    const detectFrame = async () => {
      if (!this.isRunning) return;

      const currentTime = performance.now();
      
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 캔버스 크기를 비디오 크기에 맞춤
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 캔버스 초기화 (투명하게)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Face API 옵션 설정
        const detectionOptions = new faceapi.SsdMobilenetv1Options({
          minConfidence: options.minConfidence || 0.5,
          maxResults: 10
        });

        // 얼굴 감지 실행
        let detections = await faceapi
          .detectAllFaces(video, detectionOptions)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        this.stats.totalFrames++;

        if (detections.length > 0) {
          this.stats.detectedFrames++;

          // 캔버스 크기에 맞게 감지 결과 조정
          const resizedDetections = faceapi.resizeResults(detections, {
            width: canvas.width,
            height: canvas.height
          });

          // 결과 데이터 업데이트
          this.latestResults = resizedDetections.map(detection => ({
            detection: detection.detection,
            landmarks: detection.landmarks,
            expressions: detection.expressions,
            ageGender: detection.age !== undefined && detection.gender !== undefined ? {
              age: detection.age,
              gender: detection.gender,
              genderProbability: detection.genderProbability
            } : undefined,
            descriptor: undefined
          }));

          // 콜백 호출
          this.resultCallbacks.forEach(callback => {
            callback(this.latestResults);
          });

          // 감지 결과 렌더링
          this.renderDetections(ctx, resizedDetections, options);
        } else {
          // 감지 결과가 없을 때도 콜백 호출
          this.latestResults = [];
          this.resultCallbacks.forEach(callback => {
            callback(this.latestResults);
          });
        }

        // FPS 계산
        const frameTime = currentTime - this.frameStartTime;
        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > this.maxFrameTimes) {
          this.frameTimes.shift();
        }
        
        const avgFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
        this.stats.averageFPS = 1000 / avgFrameTime;
        
        this.frameStartTime = currentTime;

      } catch (error) {
        console.error('Face detection error:', error);
      }

      // 다음 프레임 예약
      this.animationId = requestAnimationFrame(detectFrame);
    };

    detectFrame();
  }

  private renderDetections(
    ctx: CanvasRenderingContext2D,
    detections: any[],
    options: Partial<FaceDetectionOptions>
  ): void {
    detections.forEach((detection) => {
      const { detection: box, landmarks, expressions, age, gender } = detection;

      // 얼굴 경계 박스 그리기
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.box.x, box.box.y, box.box.width, box.box.height);

      // 랜드마크 그리기 (68점)
      if (options.detectLandmarks && landmarks) {
        ctx.fillStyle = '#ff0000';
        landmarks.positions.forEach((point: any) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // 나이/성별 표시
      if (options.detectAgeGender && age && gender) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText(
          `${Math.round(age)}세 ${gender}`,
          box.box.x,
          box.box.y - 10
        );
      }

      // 감정 표시
      if (options.detectExpressions && expressions) {
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        
        ctx.fillStyle = '#ffff00';
        ctx.font = '14px Arial';
        ctx.fillText(
          `${maxExpression}: ${(expressions[maxExpression] * 100).toFixed(1)}%`,
          box.box.x,
          box.box.y + box.box.height + 20
        );
      }
    });
  }

  stopDetection(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  isDetecting(): boolean {
    return this.isRunning;
  }

  isModelsLoaded(): boolean {
    // Face API 네트워크 직접 확인
    return faceapi.nets.ssdMobilenetv1.isLoaded &&
           faceapi.nets.faceLandmark68Net.isLoaded &&
           faceapi.nets.faceExpressionNet.isLoaded &&
           faceapi.nets.ageGenderNet.isLoaded;
  }

  getStats(): DetectionStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = {
      averageFPS: 0,
      totalFrames: 0,
      detectedFrames: 0,
    };
    this.frameTimes = [];
  }

  // 결과 콜백 등록
  onResults(callback: (results: FaceDetectionResult[]) => void): () => void {
    this.resultCallbacks.push(callback);
    
    // 언등록 함수 반환
    return () => {
      const index = this.resultCallbacks.indexOf(callback);
      if (index > -1) {
        this.resultCallbacks.splice(index, 1);
      }
    };
  }

  // 최신 결과 가져오기
  getLatestResults(): FaceDetectionResult[] {
    return [...this.latestResults];
  }
}

export const faceDetectionService = new FaceDetectionServiceImpl();