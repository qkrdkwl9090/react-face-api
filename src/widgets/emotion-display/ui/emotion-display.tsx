import { useMemo, memo } from 'react';

interface EmotionData {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

interface EmotionDisplayProps {
  emotions: EmotionData | null;
  className?: string;
}

// 감정별 한국어 라벨과 색상 매핑
const emotionConfig = {
  neutral: { label: '평온', color: 'bg-slate-500', textColor: 'text-slate-300' },
  happy: { label: '행복', color: 'bg-yellow-500', textColor: 'text-yellow-300' },
  sad: { label: '슬픔', color: 'bg-blue-500', textColor: 'text-blue-300' },
  angry: { label: '분노', color: 'bg-red-500', textColor: 'text-red-300' },
  fearful: { label: '두려움', color: 'bg-purple-500', textColor: 'text-purple-300' },
  disgusted: { label: '혐오', color: 'bg-green-500', textColor: 'text-green-300' },
  surprised: { label: '놀람', color: 'bg-orange-500', textColor: 'text-orange-300' },
} as const;

function EmotionDisplayComponent({ emotions, className = '' }: EmotionDisplayProps) {
  // 감정 데이터를 확률 순으로 정렬
  const sortedEmotions = useMemo(() => {
    if (!emotions) return [];

    return Object.entries(emotions)
      .map(([emotion, probability]) => ({
        emotion: emotion as keyof EmotionData,
        probability,
        config: emotionConfig[emotion as keyof typeof emotionConfig]
      }))
      .sort((a, b) => b.probability - a.probability);
  }, [emotions]);

  // 가장 높은 확률의 감정
  const dominantEmotion = sortedEmotions[0];

  if (!emotions || sortedEmotions.length === 0) {
    return (
      <div className={`glass-card p-4 ${className}`}>
        <div className="text-center">
          <div className="text-slate-400 text-sm">감정 분석 대기 중</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="space-y-4">
        {/* 주요 감정 표시 */}
        <div className="text-center pb-3 border-b border-slate-600/30">
          <div className="text-lg font-semibold text-white mb-1">
            {dominantEmotion.config.label}
          </div>
          <div className={`text-2xl font-bold ${dominantEmotion.config.textColor}`}>
            {(dominantEmotion.probability * 100).toFixed(1)}%
          </div>
        </div>

        {/* 모든 감정 확률 표시 */}
        <div className="space-y-2">
          {sortedEmotions.map(({ emotion, probability, config }) => (
            <div key={emotion} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className="text-slate-300 text-sm">{config.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${config.color} transition-all duration-300`}
                    style={{ width: `${probability * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-12 text-right">
                  {(probability * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const EmotionDisplay = memo(EmotionDisplayComponent);