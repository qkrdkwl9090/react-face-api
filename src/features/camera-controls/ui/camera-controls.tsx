import { Button } from '@/shared/ui/components';
import { useCamera } from '@/shared/lib/hooks';

export function CameraControls() {
  const { isActive, isLoading, error, startCamera, stopCamera, devices, selectedDeviceId, selectDevice } = useCamera();

  const handleToggleCamera = async () => {
    if (isActive) {
      stopCamera();
    } else {
      if (selectedDeviceId) {
        await startCamera(selectedDeviceId);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 카메라 선택 */}
      {devices.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-sm font-medium text-white mb-3">카메라 선택</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => selectDevice(device.deviceId)}
                disabled={isLoading}
                className={`p-3 text-left rounded-lg border transition-all ${
                  selectedDeviceId === device.deviceId
                    ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                    : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedDeviceId === device.deviceId && isActive
                      ? 'bg-green-400'
                      : selectedDeviceId === device.deviceId
                      ? 'bg-blue-400'
                      : 'bg-gray-400'
                  }`} />
                  <span className="text-sm font-medium truncate">
                    {device.label}
                  </span>
                </div>
                {selectedDeviceId === device.deviceId && (
                  <div className="text-xs text-blue-300 mt-1">
                    {isActive ? '활성 중' : '선택됨'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 컨트롤 버튼 */}
      <div className="flex flex-wrap gap-3">
        <Button 
          size="md" 
          onClick={handleToggleCamera}
          disabled={isLoading}
          className={isActive ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          {isLoading ? '연결 중...' : isActive ? '카메라 정지' : '카메라 시작'}
        </Button>
        
        <Button variant="secondary" size="md" disabled={isLoading}>
          설정
        </Button>
      </div>

      {error && (
        <div className="w-full mt-2 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}