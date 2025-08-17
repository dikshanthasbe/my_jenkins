import { useState, useMemo } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  User,
  Calendar,
  Clock,
  Download
} from 'lucide-react';
import type { JenkinsJob } from '../../types/jenkins';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate, formatDuration, formatRelativeTime, exportToCSV } from '../../lib/utils';

interface JobsTableProps {
  jobs: JenkinsJob[];
  isLoading?: boolean;
}

export function JobsTable({ jobs, isLoading }: JobsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<JenkinsJob>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Job Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.folder}</div>
          </div>
          {row.original.url && (
            <a
              href={row.original.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'last_build_status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.last_build_status} />,
    },
    {
      accessorKey: 'last_build_date',
      header: 'Last Build',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-900">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(row.original.last_build_date)}
          </div>
          <div className="text-gray-500">
            {formatRelativeTime(row.original.last_build_date)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'success_rate',
      header: 'Success Rate',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${row.original.success_rate}%` }}
            />
          </div>
          <span className="text-sm font-medium">{row.original.success_rate.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'avg_build_duration',
      header: 'Avg Duration',
      cell: ({ row }) => (
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          {formatDuration(row.original.avg_build_duration)}
        </div>
      ),
    },
    {
      accessorKey: 'total_builds',
      header: 'Builds',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="font-medium">{row.original.total_builds}</div>
          <div className="text-gray-500">
            {row.original.success_count}✓ {row.original.failure_count}✗
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'owner_name',
      header: 'Owner',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.owner_name ? (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1 text-gray-400" />
              <div>
                <div className="font-medium">{row.original.owner_name}</div>
                {row.original.owner_email && (
                  <div className="text-gray-500">{row.original.owner_email}</div>
                )}
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'ownership_status',
      header: 'Ownership',
      cell: ({ row }) => {
        const status = row.original.ownership_status;
        const statusColors = {
          complete: 'bg-green-100 text-green-800',
          attention_required: 'bg-yellow-100 text-yellow-800',
          unassigned: 'bg-gray-100 text-gray-800',
        };
        
        return (
          <span className={`status-badge ${statusColors[status]}`}>
            {status.replace('_', ' ')}
          </span>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: jobs,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 25 },
    },
  });

  const handleExport = () => {
    exportToCSV(jobs, `jenkins-jobs-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-4">
                <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Jenkins Jobs ({jobs.length})
        </h2>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getIsSorted() && (
                        <span className="text-primary-600">
                          {header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            jobs.length
          )}{' '}
          of {jobs.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}