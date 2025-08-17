import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  Activity, 
  BarChart3, 
  Trash2, 
  Settings,
  RefreshCw,
  Clock
} from 'lucide-react';

import { useJenkinsJobs, useDashboardStats, useFilteredJobs } from './hooks/useJenkinsData';
import { StatsCards } from './components/dashboard/StatsCards';
import { FilterBar } from './components/dashboard/FilterBar';
import { JobsTable } from './components/dashboard/JobsTable';
import { SyncButton } from './components/dashboard/SyncButton';
import { BuildDurationChart } from './components/analytics/BuildDurationChart';
import { StatusDistributionChart } from './components/analytics/StatusDistributionChart';
import { LoadingCard } from './components/ui/LoadingSpinner';

// Mock toast for now since react-hot-toast is not installed
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
};

// Mock Toaster component
function Toaster({ position, toastOptions }: any) {
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'cleanup'>('overview');
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    folders: [],
    ownership: [],
    showDisabled: true,
    showTestJobs: true,
    showInactive: true,
  });

  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useJenkinsJobs();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  
  const filteredJobs = useFilteredJobs(jobs, filters);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'cleanup', label: 'Cleanup Insights', icon: Trash2 },
  ];

  if (jobsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">
              Unable to connect to Jenkins API. Please check your configuration.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jenkins Dashboard</h1>
                <p className="text-sm text-gray-600">Modern pipeline monitoring and analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {stats && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last sync: {new Date().toLocaleTimeString()}</span>
                </div>
              )}
              <SyncButton />
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            {stats ? (
              <StatsCards stats={stats} isLoading={statsLoading} />
            ) : (
              <LoadingCard />
            )}

            {/* Filters */}
            <FilterBar 
              jobs={jobs} 
              filters={filters} 
              onFiltersChange={setFilters} 
            />

            {/* Jobs Table */}
            <JobsTable jobs={filteredJobs} isLoading={jobsLoading} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StatusDistributionChart jobs={jobs} />
              <BuildDurationChart jobs={jobs} />
            </div>
            
            {/* Additional analytics can be added here */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {jobs.filter(job => job.success_rate > 90).length}
                  </div>
                  <div className="text-sm text-gray-600">High Performing Jobs ({'>'}90%)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">
                    {jobs.filter(job => job.success_rate < 70 && job.success_rate > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Needs Attention ({'<'}70%)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {jobs.filter(job => job.avg_build_duration > 600000).length}
                  </div>
                  <div className="text-sm text-gray-600">Long Running Jobs ({'>'}10min)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cleanup' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Test Jobs */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Test Jobs ({jobs.filter(job => job.is_test_job).length})
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Jobs identified as test or demo environments that may be candidates for cleanup.
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {jobs.filter(job => job.is_test_job).slice(0, 10).map(job => (
                    <div key={job.name} className="text-sm">
                      <div className="font-medium text-gray-900">{job.name}</div>
                      <div className="text-gray-500">{job.folder}</div>
                    </div>
                  ))}
                  {jobs.filter(job => job.is_test_job).length > 10 && (
                    <div className="text-sm text-gray-500">
                      +{jobs.filter(job => job.is_test_job).length - 10} more...
                    </div>
                  )}
                </div>
              </div>

              {/* Inactive Jobs */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Inactive Jobs ({jobs.filter(job => (job.days_since_last_build || 0) > 60).length})
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Jobs that haven't been built in the last 60 days.
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {jobs.filter(job => (job.days_since_last_build || 0) > 60).slice(0, 10).map(job => (
                    <div key={job.name} className="text-sm">
                      <div className="font-medium text-gray-900">{job.name}</div>
                      <div className="text-gray-500">
                        {job.days_since_last_build} days ago • {job.folder}
                      </div>
                    </div>
                  ))}
                  {jobs.filter(job => (job.days_since_last_build || 0) > 60).length > 10 && (
                    <div className="text-sm text-gray-500">
                      +{jobs.filter(job => (job.days_since_last_build || 0) > 60).length - 10} more...
                    </div>
                  )}
                </div>
              </div>

              {/* Disabled Jobs */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  Disabled Jobs ({jobs.filter(job => job.is_disabled).length})
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Jobs that are currently disabled and may be safe to remove.
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {jobs.filter(job => job.is_disabled).slice(0, 10).map(job => (
                    <div key={job.name} className="text-sm">
                      <div className="font-medium text-gray-900">{job.name}</div>
                      <div className="text-gray-500">{job.folder}</div>
                    </div>
                  ))}
                  {jobs.filter(job => job.is_disabled).length > 10 && (
                    <div className="text-sm text-gray-500">
                      +{jobs.filter(job => job.is_disabled).length - 10} more...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cleanup Recommendations */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cleanup Recommendations
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Review Test Jobs</h4>
                    <p className="text-sm text-gray-600">
                      Consider archiving or removing {jobs.filter(job => job.is_test_job).length} test jobs 
                      that are no longer needed for development or testing purposes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Archive Inactive Jobs</h4>
                    <p className="text-sm text-gray-600">
                      {jobs.filter(job => (job.days_since_last_build || 0) > 60).length} jobs haven't been 
                      built recently. Consider archiving them to reduce clutter.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Remove Disabled Jobs</h4>
                    <p className="text-sm text-gray-600">
                      {jobs.filter(job => job.is_disabled).length} disabled jobs can likely be safely 
                      removed if they're no longer needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;