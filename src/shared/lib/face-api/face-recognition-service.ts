import type {
  FaceRecognitionService,
  RegisteredFace,
  FaceMatch,
  FaceRecognitionOptions
} from '@/shared/lib/face-api/types';

class FaceRecognitionServiceImpl implements FaceRecognitionService {
  private registeredFaces: RegisteredFace[] = [];
  private readonly STORAGE_KEY = 'face-api-registered-faces';

  constructor() {
    this.loadFromStorage();
  }

  // 얼굴 등록
  registerFace(name: string, descriptor: Float32Array): string {
    const id = this.generateId();
    const registeredFace: RegisteredFace = {
      id,
      name: name.trim(),
      descriptor,
      createdAt: new Date()
    };

    this.registeredFaces.push(registeredFace);
    this.saveToStorage();
    
    return id;
  }

  // 등록된 얼굴 삭제
  deleteFace(faceId: string): boolean {
    const initialLength = this.registeredFaces.length;
    this.registeredFaces = this.registeredFaces.filter(face => face.id !== faceId);
    
    if (this.registeredFaces.length < initialLength) {
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  // 얼굴 매칭 검색
  findMatches(
    descriptor: Float32Array, 
    options: Partial<FaceRecognitionOptions> = {}
  ): FaceMatch[] {
    const { threshold = 0.6, maxResults = 5 } = options;
    
    if (this.registeredFaces.length === 0) {
      return [];
    }

    // 유클리드 거리 계산으로 얼굴 매칭
    const matches: FaceMatch[] = this.registeredFaces
      .map(registeredFace => {
        const distance = this.calculateDistance(descriptor, registeredFace.descriptor);
        const confidence = Math.max(0, 1 - distance);
        
        return {
          registeredFace,
          distance,
          confidence
        };
      })
      .filter(match => match.distance <= threshold) // 임계값 이하만 매칭으로 인정
      .sort((a, b) => a.distance - b.distance) // 거리 오름차순 정렬
      .slice(0, maxResults); // 최대 결과 수 제한

    return matches;
  }

  // 모든 등록된 얼굴 가져오기
  getAllRegisteredFaces(): RegisteredFace[] {
    return [...this.registeredFaces];
  }

  // 모든 얼굴 삭제
  clearAllFaces(): void {
    this.registeredFaces = [];
    this.saveToStorage();
  }

  // 유클리드 거리 계산
  private calculateDistance(desc1: Float32Array, desc2: Float32Array): number {
    if (desc1.length !== desc2.length) {
      throw new Error('Face descriptors must have the same length');
    }

    let sum = 0;
    for (let i = 0; i < desc1.length; i++) {
      const diff = desc1[i] - desc2[i];
      sum += diff * diff;
    }
    
    return Math.sqrt(sum);
  }

  // 고유 ID 생성
  private generateId(): string {
    return `face_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // 로컬 스토리지에서 데이터 로드
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.registeredFaces = data.map((face: any) => ({
          ...face,
          descriptor: new Float32Array(face.descriptor),
          createdAt: new Date(face.createdAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load registered faces from storage:', error);
      this.registeredFaces = [];
    }
  }

  // 로컬 스토리지에 데이터 저장
  private saveToStorage(): void {
    try {
      const dataToStore = this.registeredFaces.map(face => ({
        ...face,
        descriptor: Array.from(face.descriptor), // Float32Array를 일반 배열로 변환
        createdAt: face.createdAt.toISOString()
      }));
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save registered faces to storage:', error);
    }
  }
}

export const faceRecognitionService = new FaceRecognitionServiceImpl();