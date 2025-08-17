import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import type { JenkinsJob } from '../../types/jenkins';
import { formatDuration } from '../../lib/utils';

interface BuildDurationChartProps {
  jobs: JenkinsJob[];
}

export function BuildDurationChart({ jobs }: BuildDurationChartProps) {
  // Group jobs by folder and calculate average durations
  const folderData = jobs.reduce((acc, job) => {
    const folder = job.folder === '/' ? 'Root' : job.folder;
    if (!acc[folder]) {
      acc[folder] = {
        folder,
        totalDuration: 0,
        successDuration: 0,
        failedDuration: 0,
        count: 0,
        successCount: 0,
        failedCount: 0,
      };
    }
    
    acc[folder].totalDuration += job.avg_build_duration;
    acc[folder].count += 1;
    
    if (job.avg_successful_duration > 0) {
      acc[folder].successDuration += job.avg_successful_duration;
      acc[folder].successCount += 1;
    }
    
    if (job.avg_failed_duration > 0) {
      acc[folder].failedDuration += job.avg_failed_duration;
      acc[folder].failedCount += 1;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(folderData).map((folder: any) => ({
    folder: folder.folder,
    avgDuration: Math.round(folder.totalDuration / folder.count / 1000), // Convert to seconds
    avgSuccess: folder.successCount > 0 ? Math.round(folder.successDuration / folder.successCount / 1000) : 0,
    avgFailed: folder.failedCount > 0 ? Math.round(folder.failedDuration / folder.failedCount / 1000) : 0,
  })).sort((a, b) => b.avgDuration - a.avgDuration);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Folder: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatDuration(entry.value * 1000)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Average Build Duration by Folder
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="folder" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}s`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="avgDuration" 
              name="Average Duration"
              fill="#3b82f6" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="avgSuccess" 
              name="Average Success"
              fill="#22c55e" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="avgFailed" 
              name="Average Failed"
              fill="#ef4444" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}