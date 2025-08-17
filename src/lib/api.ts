import axios from 'axios';
import { JenkinsJob, DashboardStats, ApiResponse, SyncResponse } from '../types/jenkins';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jenkins_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jenkins_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const jenkinsApi = {
  // Get all jobs
  getJobs: async (): Promise<JenkinsJob[]> => {
    const response = await api.get<ApiResponse<JenkinsJob[]>>('/jobs');
    return response.data.data;
  },

  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/stats');
    return response.data.data;
  },

  // Sync data from Jenkins
  syncData: async (): Promise<SyncResponse> => {
    const response = await api.post<ApiResponse<SyncResponse>>('/sync');
    return response.data.data;
  },

  // Get job details
  getJobDetails: async (jobName: string): Promise<JenkinsJob> => {
    const response = await api.get<ApiResponse<JenkinsJob>>(`/jobs/${encodeURIComponent(jobName)}`);
    return response.data.data;
  },

  // Update job ownership
  updateJobOwnership: async (jobName: string, ownership: Partial<JenkinsJob>): Promise<JenkinsJob> => {
    const response = await api.patch<ApiResponse<JenkinsJob>>(
      `/jobs/${encodeURIComponent(jobName)}/ownership`,
      ownership
    );
    return response.data.data;
  },

  // Test Jenkins connectivity
  testConnection: async (): Promise<{ connected: boolean; message: string }> => {
    const response = await api.get<ApiResponse<{ connected: boolean; message: string }>>('/test-connection');
    return response.data.data;
  },

  // Get cleanup insights
  getCleanupInsights: async () => {
    const response = await api.get<ApiResponse<{
      test_jobs: JenkinsJob[];
      inactive_jobs: JenkinsJob[];
      disabled_jobs: JenkinsJob[];
    }>>('/cleanup-insights');
    return response.data.data;
  },
};

// Mock API for development (when backend is not available)
export const mockApi = {
  getJobs: async (): Promise<JenkinsJob[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `job-${i + 1}`,
      url: `https://jenkins.example.com/job/job-${i + 1}/`,
      type: 'hudson.model.FreeStyleProject',
      description: `Description for job ${i + 1}`,
      last_build_status: ['SUCCESS', 'FAILURE', 'UNSTABLE', 'ABORTED'][Math.floor(Math.random() * 4)] as any,
      last_build_url: `https://jenkins.example.com/job/job-${i + 1}/123/`,
      folder: i % 3 === 0 ? 'frontend' : i % 3 === 1 ? 'backend' : 'devops',
      is_disabled: Math.random() > 0.8,
      last_build_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_successful_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_failed_date: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      days_since_last_build: Math.floor(Math.random() * 90),
      total_builds: Math.floor(Math.random() * 500) + 10,
      success_count: Math.floor(Math.random() * 400) + 5,
      failure_count: Math.floor(Math.random() * 100),
      success_rate: Math.floor(Math.random() * 100),
      is_test_job: Math.random() > 0.7,
      last_build_duration: Math.floor(Math.random() * 600000) + 30000,
      last_successful_duration: Math.floor(Math.random() * 600000) + 30000,
      last_failed_duration: Math.floor(Math.random() * 600000) + 30000,
      avg_build_duration: Math.floor(Math.random() * 300000) + 60000,
      avg_successful_duration: Math.floor(Math.random() * 300000) + 60000,
      avg_failed_duration: Math.floor(Math.random() * 300000) + 60000,
      min_build_duration: Math.floor(Math.random() * 60000) + 10000,
      max_build_duration: Math.floor(Math.random() * 1200000) + 300000,
      total_build_duration: Math.floor(Math.random() * 10000000) + 1000000,
      owner_name: Math.random() > 0.5 ? `Owner ${i + 1}` : undefined,
      owner_email: Math.random() > 0.5 ? `owner${i + 1}@example.com` : undefined,
      other_tag: Math.random() > 0.7 ? `tag-${i + 1}` : undefined,
      ownership_status: ['complete', 'attention_required', 'unassigned'][Math.floor(Math.random() * 3)] as any,
      last_user: `user${Math.floor(Math.random() * 10) + 1}`,
      last_editor: `editor${Math.floor(Math.random() * 10) + 1}`,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  },

  getStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      total_jobs: 150,
      success_rate: 85.5,
      failure_rate: 14.5,
      avg_build_duration: 180000,
      active_jobs: 120,
      disabled_jobs: 30,
      test_jobs: 25,
      inactive_jobs: 15,
    };
  },

  syncData: async (): Promise<SyncResponse> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      jobs_synced: 150,
      sync_duration: 2.5,
      last_sync_time: new Date().toISOString(),
    };
  },
};

// Use mock API in development, real API in production
export const api_client = import.meta.env.DEV ? mockApi : jenkinsApi;