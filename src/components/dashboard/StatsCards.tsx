import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Server, 
  AlertTriangle,
  TestTube,
  Pause
} from 'lucide-react';
import { DashboardStats } from '../../types/jenkins';
import { formatDuration } from '../../lib/utils';

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Jobs',
      value: stats.total_jobs.toLocaleString(),
      icon: Server,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Success Rate',
      value: `${stats.success_rate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Failure Rate',
      value: `${stats.failure_rate.toFixed(1)}%`,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Avg Build Time',
      value: formatDuration(stats.avg_build_duration),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Jobs',
      value: stats.active_jobs.toLocaleString(),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Disabled Jobs',
      value: stats.disabled_jobs.toLocaleString(),
      icon: Pause,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Test Jobs',
      value: stats.test_jobs.toLocaleString(),
      icon: TestTube,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Inactive Jobs',
      value: stats.inactive_jobs.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}