import { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useSyncData } from '../../hooks/useJenkinsData';

export function SyncButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const syncMutation = useSyncData();

  const handleSync = () => {
    syncMutation.mutate();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Confirm Data Sync</p>
            <p className="text-yellow-700">This will fetch latest data from Jenkins</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="btn-primary text-sm"
          >
            {syncMutation.isPending ? 'Syncing...' : 'Confirm'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      disabled={syncMutation.isPending}
      className="btn-primary flex items-center space-x-2"
    >
      <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
      <span>{syncMutation.isPending ? 'Syncing...' : 'Sync Data'}</span>
    </button>
  );
}