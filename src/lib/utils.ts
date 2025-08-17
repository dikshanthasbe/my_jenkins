import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDuration(milliseconds: number): string {
  if (!milliseconds || milliseconds === 0) return '0s';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Never';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Never';
  
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'SUCCESS':
      return 'status-success';
    case 'FAILURE':
      return 'status-failure';
    case 'UNSTABLE':
      return 'status-unstable';
    case 'ABORTED':
      return 'status-aborted';
    case 'IN_PROGRESS':
      return 'status-in-progress';
    default:
      return 'status-not-built';
  }
}

export function calculateSuccessRate(successCount: number, totalBuilds: number): number {
  if (totalBuilds === 0) return 0;
  return Math.round((successCount / totalBuilds) * 100);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function exportToCSV(data: any[], filename: string): void {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}