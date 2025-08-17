import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api_client } from '../lib/api';
import type { JenkinsJob, DashboardStats } from '../types/jenkins';

// Mock toast for now since react-hot-toast is not installed
const toast = {
  success: (message: string, options?: any) => console.log('Success:', message),
  error: (message: string, options?: any) => console.error('Error:', message),
};

export const useJenkinsJobs = () => {
  return useQuery({
    queryKey: ['jenkins-jobs'],
    queryFn: api_client.getJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api_client.getStats,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useSyncData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api_client.syncData,
    onSuccess: (data) => {
      // Invalidate and refetch jobs data
      queryClient.invalidateQueries({ queryKey: ['jenkins-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      toast.success(
        `Successfully synced ${data.jobs_synced} jobs in ${data.sync_duration}s`,
        { duration: 4000 }
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to sync data from Jenkins',
        { duration: 4000 }
      );
    },
  });
};

export const useJobDetails = (jobName: string) => {
  return useQuery({
    queryKey: ['job-details', jobName],
    queryFn: () => api_client.getJobDetails(jobName),
    enabled: !!jobName,
  });
};

// Custom hook for filtering and sorting jobs
export const useFilteredJobs = (
  jobs: JenkinsJob[] | undefined,
  filters: {
    search: string;
    status: string[];
    folders: string[];
    ownership: string[];
    showDisabled: boolean;
    showTestJobs: boolean;
    showInactive: boolean;
  }
) => {
  if (!jobs) return [];

  return jobs.filter(job => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        job.name.toLowerCase().includes(searchLower) ||
        job.folder.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.owner_name?.toLowerCase().includes(searchLower) ||
        job.owner_email?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(job.last_build_status)) {
      return false;
    }

    // Folder filter
    if (filters.folders.length > 0 && !filters.folders.includes(job.folder)) {
      return false;
    }

    // Ownership filter
    if (filters.ownership.length > 0 && !filters.ownership.includes(job.ownership_status)) {
      return false;
    }

    // Disabled jobs filter
    if (!filters.showDisabled && job.is_disabled) {
      return false;
    }

    // Test jobs filter
    if (!filters.showTestJobs && job.is_test_job) {
      return false;
    }

    // Inactive jobs filter (jobs not built in last 60 days)
    if (!filters.showInactive && (job.days_since_last_build || 0) > 60) {
      return false;
    }

    return true;
  });
};