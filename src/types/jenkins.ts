export interface JenkinsJob {
  id?: number;
  name: string;
  url: string;
  type: string;
  description?: string;
  last_build_status: BuildStatus;
  last_build_url?: string;
  folder: string;
  is_disabled: boolean;
  last_build_date?: string;
  last_successful_date?: string;
  last_failed_date?: string;
  days_since_last_build?: number;
  total_builds: number;
  success_count: number;
  failure_count: number;
  success_rate: number;
  is_test_job: boolean;
  last_build_duration: number;
  last_successful_duration: number;
  last_failed_duration: number;
  avg_build_duration: number;
  avg_successful_duration: number;
  avg_failed_duration: number;
  min_build_duration: number;
  max_build_duration: number;
  total_build_duration: number;
  owner_name?: string;
  owner_email?: string;
  other_tag?: string;
  ownership_status: OwnershipStatus;
  last_user?: string;
  last_editor?: string;
  created_at?: string;
  updated_at?: string;
}

export type BuildStatus = 
  | 'SUCCESS' 
  | 'FAILURE' 
  | 'UNSTABLE' 
  | 'ABORTED' 
  | 'IN_PROGRESS' 
  | 'NOT_BUILT' 
  | 'Unknown';

export type OwnershipStatus = 
  | 'complete' 
  | 'attention_required' 
  | 'unassigned';

export interface DashboardStats {
  total_jobs: number;
  success_rate: number;
  failure_rate: number;
  avg_build_duration: number;
  active_jobs: number;
  disabled_jobs: number;
  test_jobs: number;
  inactive_jobs: number;
}

export interface FilterOptions {
  search: string;
  status: BuildStatus[];
  folders: string[];
  ownership: OwnershipStatus[];
  showDisabled: boolean;
  showTestJobs: boolean;
  showInactive: boolean;
}

export interface SortConfig {
  key: keyof JenkinsJob;
  direction: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface SyncResponse {
  jobs_synced: number;
  sync_duration: number;
  last_sync_time: string;
}