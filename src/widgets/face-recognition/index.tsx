import { Card, CardHeader, CardContent, Button } from '@/shared/ui/components';
import { useFaceRecognition, useFaceResults } from '@/shared/lib/hooks';
import { useState, useCallback, useEffect, memo } from 'react';
import type { FaceMatch, FaceDetectionResult } from '@/shared/lib/face-api/types';

function FaceRecognitionComponent() {
  const { 
    registeredFaces, 
    registerFace, 
    deleteFace, 
    findMatches, 
    clearAllFaces,
    isRegistering,
    error: recognitionError
  } = useFaceRecognition();

  const { latestResults } = useFaceResults();

  const [newFaceName, setNewFaceName] = useState('');
  const [matches, setMatches] = useState<FaceMatch[]>([]);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // 현재 감지된 얼굴과 등록된 얼굴을 매칭
  const performMatching = useCallback(() => {
    if (!latestResults || latestResults.length === 0) {
      setMatches([]);
      return;
    }

    const currentResults = latestResults.filter((result: FaceDetectionResult) => result.descriptor);
    if (currentResults.length === 0) {
      setMatches([]);
      return;
    }

    // 첫 번째 감지된 얼굴에 대해 매칭 수행
    const firstFace = currentResults[0];
    if (firstFace.descriptor) {
      const foundMatches = findMatches(firstFace.descriptor, {
        threshold: 0.6,
        maxResults: 3
      });
      setMatches(foundMatches);
    }
  }, [latestResults, findMatches]);

  // 새 얼굴 등록
  const handleRegisterFace = useCallback(() => {
    if (!newFaceName.trim()) {
      setRegisterError('이름을 입력해주세요.');
      return;
    }

    if (!latestResults || latestResults.length === 0) {
      setRegisterError('감지된 얼굴이 없습니다.');
      return;
    }

    const currentResults = latestResults.filter((result: FaceDetectionResult) => result.descriptor);
    if (currentResults.length === 0) {
      setRegisterError('얼굴 descriptor가 추출되지 않았습니다.');
      return;
    }

    const firstFace = currentResults[0];
    if (firstFace.descriptor) {
      const faceId = registerFace(newFaceName.trim(), firstFace.descriptor);
      if (faceId) {
        setNewFaceName('');
        setRegisterError(null);
      }
    }
  }, [newFaceName, latestResults, registerFace]);

  // 얼굴 삭제
  const handleDeleteFace = useCallback((faceId: string) => {
    deleteFace(faceId);
  }, [deleteFace]);

  // 모든 얼굴 삭제
  const handleClearAll = useCallback(() => {
    if (window.confirm('등록된 모든 얼굴을 삭제하시겠습니까?')) {
      clearAllFaces();
      setMatches([]);
    }
  }, [clearAllFaces]);

  // 실시간 매칭 수행
  useEffect(() => {
    if (registeredFaces.length > 0) {
      performMatching();
    }
  }, [latestResults, registeredFaces, performMatching]);

  const error = recognitionError || registerError;
  const hasDetectedFace = latestResults && latestResults.length > 0 && 
    latestResults.some((result: FaceDetectionResult) => result.descriptor);

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">얼굴 등록 및 매칭</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-400 text-xs bg-red-900/20 rounded px-2 py-1">
            {error}
          </div>
        )}

        {/* 얼굴 등록 섹션 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300">새 얼굴 등록</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFaceName}
              onChange={(e) => setNewFaceName(e.target.value)}
              placeholder="이름 입력..."
              className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/40 rounded text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              disabled={isRegistering}
            />
            <Button
              size="sm"
              onClick={handleRegisterFace}
              disabled={isRegistering || !hasDetectedFace || !newFaceName.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isRegistering ? '등록 중...' : '등록'}
            </Button>
          </div>
          {!hasDetectedFace && (
            <p className="text-xs text-slate-400">
              얼굴이 감지되면 등록할 수 있습니다.
            </p>
          )}
        </div>

        {/* 매칭 결과 섹션 */}
        {matches.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">매칭 결과</h4>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-600/30"
                >
                  <div>
                    <p className="text-white font-medium">{match.registeredFace.name}</p>
                    <p className="text-xs text-slate-400">
                      유사도: {(match.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    match.confidence > 0.8 
                      ? 'bg-green-400' 
                      : match.confidence > 0.6 
                      ? 'bg-yellow-400' 
                      : 'bg-red-400'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 등록된 얼굴 목록 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300">
              등록된 얼굴 ({registeredFaces.length})
            </h4>
            {registeredFaces.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearAll}
                className="text-xs"
              >
                전체 삭제
              </Button>
            )}
          </div>

          {registeredFaces.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-slate-600 rounded"></div>
              </div>
              <p>등록된 얼굴이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {registeredFaces.map((face) => (
                <div
                  key={face.id}
                  className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-600/30"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{face.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(face.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteFace(face.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const FaceRecognition = memo(FaceRecognitionComponent);