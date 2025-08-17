import { cn, getStatusColor } from '../../lib/utils';
import { BuildStatus } from '../../types/jenkins';

interface StatusBadgeProps {
  status: BuildStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusIcon = (status: BuildStatus) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return '✓';
      case 'FAILURE':
        return '✗';
      case 'UNSTABLE':
        return '⚠';
      case 'ABORTED':
        return '⊘';
      case 'IN_PROGRESS':
        return '⟳';
      default:
        return '?';
    }
  };

  return (
    <span className={cn('status-badge', getStatusColor(status), className)}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      {status.replace('_', ' ')}
    </span>
  );
}