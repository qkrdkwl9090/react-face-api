interface AgeGenderData {
  age: number;
  gender: string;
  genderProbability: number;
}

interface AgeGenderDisplayProps {
  ageGender: AgeGenderData | null;
  className?: string;
}

export function AgeGenderDisplay({ ageGender, className = '' }: AgeGenderDisplayProps) {
  if (!ageGender) {
    return (
      <div className={`glass-card p-4 ${className}`}>
        <div className="text-center">
          <div className="text-slate-400 text-sm">나이/성별 분석 대기 중</div>
        </div>
      </div>
    );
  }

  const { age, gender, genderProbability } = ageGender;
  const genderLabel = gender === 'male' ? '남성' : '여성';
  const genderColor = gender === 'male' ? 'text-blue-300' : 'text-pink-300';
  const confidenceColor = genderProbability > 0.8 ? 'text-green-300' : 
                         genderProbability > 0.6 ? 'text-yellow-300' : 'text-red-300';

  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="space-y-4">
        {/* 나이 표시 */}
        <div className="text-center pb-3 border-b border-slate-600/30">
          <div className="text-lg font-semibold text-white mb-1">추정 나이</div>
          <div className="text-2xl font-bold text-blue-300">
            {Math.round(age)}세
          </div>
        </div>

        {/* 성별 표시 */}
        <div className="text-center">
          <div className="text-sm text-slate-400 mb-2">추정 성별</div>
          <div className={`text-xl font-semibold ${genderColor} mb-2`}>
            {genderLabel}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs text-slate-400">신뢰도:</span>
            <span className={`text-xs font-medium ${confidenceColor}`}>
              {(genderProbability * 100).toFixed(1)}%
            </span>
          </div>
          
          {/* 신뢰도 바 */}
          <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                genderProbability > 0.8 ? 'bg-green-500' :
                genderProbability > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${genderProbability * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}