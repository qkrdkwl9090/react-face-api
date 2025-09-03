import { useFaceApi } from '@/shared/lib/hooks';

interface ModelLoaderProps {
  className?: string;
}

export function ModelLoader({ className = '' }: ModelLoaderProps) {
  const { isLoading, progress, total, error, loadedModels, loadModels } = useFaceApi();

  const handleLoadModels = async () => {
    try {
      await loadModels();
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  };

  const progressPercentage = total > 0 ? Math.round((progress / total) * 100) : 0;
  const isComplete = progress === total && total > 0;

  return (
    <div className={`glass-card ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Face API Models</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Status:</span>
            <span className={`text-sm font-medium ${
              isComplete ? 'text-green-400' : 
              isLoading ? 'text-blue-400' : 
              error ? 'text-red-400' : 'text-gray-400'
            }`}>
              {isComplete ? 'All Models Loaded' : 
               isLoading ? 'Loading...' : 
               error ? 'Error' : 'Not Loaded'}
            </span>
          </div>

          {(isLoading || isComplete) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Progress</span>
                <span>{progress}/{total} ({progressPercentage}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <span className="text-gray-300 text-sm">Loaded Models ({loadedModels.length}):</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {loadedModels.map((model) => (
                <div key={model} className="text-green-400 bg-green-900/20 rounded px-2 py-1">
                  {model}
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleLoadModels}
            disabled={isLoading}
            className={`btn-primary w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Loading Models...' : isComplete ? 'Reload Models' : 'Load Models'}
          </button>
        </div>
      </div>
    </div>
  );
}