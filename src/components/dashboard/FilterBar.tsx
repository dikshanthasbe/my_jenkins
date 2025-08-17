import { useState } from 'react';
import { Filter, RotateCcw, Settings } from 'lucide-react';
import { SearchInput } from '../ui/SearchInput';
import { FilterDropdown } from '../ui/FilterDropdown';
import type { JenkinsJob } from '../../types/jenkins';

interface FilterBarProps {
  jobs: JenkinsJob[];
  filters: {
    search: string;
    status: string[];
    folders: string[];
    ownership: string[];
    showDisabled: boolean;
    showTestJobs: boolean;
    showInactive: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export function FilterBar({ jobs, filters, onFiltersChange }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generate filter options from data
  const statusOptions = Array.from(new Set(jobs.map(job => job.last_build_status)))
    .map(status => ({
      value: status,
      label: status.replace('_', ' '),
      count: jobs.filter(job => job.last_build_status === status).length,
    }));

  const folderOptions = Array.from(new Set(jobs.map(job => job.folder)))
    .map(folder => ({
      value: folder,
      label: folder === '/' ? 'Root' : folder,
      count: jobs.filter(job => job.folder === folder).length,
    }));

  const ownershipOptions = [
    {
      value: 'complete',
      label: 'Complete',
      count: jobs.filter(job => job.ownership_status === 'complete').length,
    },
    {
      value: 'attention_required',
      label: 'Attention Required',
      count: jobs.filter(job => job.ownership_status === 'attention_required').length,
    },
    {
      value: 'unassigned',
      label: 'Unassigned',
      count: jobs.filter(job => job.ownership_status === 'unassigned').length,
    },
  ];

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      folders: [],
      ownership: [],
      showDisabled: true,
      showTestJobs: true,
      showInactive: true,
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.status.length > 0 ||
    filters.folders.length > 0 ||
    filters.ownership.length > 0 ||
    !filters.showDisabled ||
    !filters.showTestJobs ||
    !filters.showInactive;

  return (
    <div className="card">
      <div className="flex flex-col space-y-4">
        {/* Main filter row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <SearchInput
              value={filters.search}
              onChange={(search) => onFiltersChange({ ...filters, search })}
              placeholder="Search jobs, folders, owners..."
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Status"
              options={statusOptions}
              selected={filters.status}
              onChange={(status) => onFiltersChange({ ...filters, status })}
              className="min-w-[140px]"
            />
            
            <FilterDropdown
              label="Folders"
              options={folderOptions}
              selected={filters.folders}
              onChange={(folders) => onFiltersChange({ ...filters, folders })}
              className="min-w-[140px]"
            />
            
            <FilterDropdown
              label="Ownership"
              options={ownershipOptions}
              selected={filters.ownership}
              onChange={(ownership) => onFiltersChange({ ...filters, ownership })}
              className="min-w-[140px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`btn-secondary flex items-center space-x-2 ${showAdvanced ? 'bg-primary-100 text-primary-700' : ''}`}
            >
              <Settings className="w-4 h-4" />
              <span>Advanced</span>
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="btn-secondary flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showDisabled}
                  onChange={(e) => onFiltersChange({ ...filters, showDisabled: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show Disabled Jobs</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showTestJobs}
                  onChange={(e) => onFiltersChange({ ...filters, showTestJobs: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show Test Jobs</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showInactive}
                  onChange={(e) => onFiltersChange({ ...filters, showInactive: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show Inactive Jobs (60+ days)</span>
              </label>
            </div>
          </div>
        )}

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>
              {jobs.length} jobs match your filters
              {filters.search && ` • Search: "${filters.search}"`}
              {filters.status.length > 0 && ` • Status: ${filters.status.length} selected`}
              {filters.folders.length > 0 && ` • Folders: ${filters.folders.length} selected`}
              {filters.ownership.length > 0 && ` • Ownership: ${filters.ownership.length} selected`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}