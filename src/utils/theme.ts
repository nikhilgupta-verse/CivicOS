import { IssueType, Department, SeverityLevel, Status } from '../types';

export function getSeverityStyle(severity: SeverityLevel) {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
        badgeBg: 'bg-red-600 text-white',
        dot: 'bg-red-600',
        border: 'border-red-500',
        text: 'text-red-600',
        accentBg: 'bg-red-500',
      };
    case 'High':
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
        badgeBg: 'bg-orange-600 text-white',
        dot: 'bg-orange-500',
        border: 'border-orange-500',
        text: 'text-orange-600',
        accentBg: 'bg-orange-500',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        badgeBg: 'bg-amber-600 text-white',
        dot: 'bg-amber-500',
        border: 'border-amber-500',
        text: 'text-amber-600',
        accentBg: 'bg-amber-500',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        badgeBg: 'bg-emerald-600 text-white',
        dot: 'bg-emerald-500',
        border: 'border-emerald-500',
        text: 'text-emerald-600',
        accentBg: 'bg-emerald-500',
      };
  }
}

export function getStatusStyle(status: Status) {
  switch (status) {
    case 'Open':
      return {
        badge: 'bg-red-100 text-red-800 border border-red-200',
        dot: 'bg-red-500',
        label: 'Open / Dispatched',
      };
    case 'In Progress':
      return {
        badge: 'bg-blue-100 text-blue-800 border border-blue-200',
        dot: 'bg-blue-500 animate-pulse',
        label: 'In Progress (Crew Active)',
      };
    case 'Resolved':
      return {
        badge: 'bg-teal-100 text-teal-800 border border-teal-200',
        dot: 'bg-teal-500',
        label: 'Resolved',
      };
    case 'Verified':
      return {
        badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
        dot: 'bg-emerald-600',
        label: 'Citizen Verified',
      };
    default:
      return {
        badge: 'bg-slate-100 text-slate-800 border border-slate-200',
        dot: 'bg-slate-500',
        label: status,
      };
  }
}

export function getDepartmentColor(dept: Department) {
  switch (dept) {
    case 'Roads Department':
      return 'bg-amber-50 text-amber-900 border-amber-200';
    case 'Sanitation Department':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    case 'Electrical Department':
      return 'bg-indigo-50 text-indigo-900 border-indigo-200';
    case 'Water Supply Department':
      return 'bg-sky-50 text-sky-900 border-sky-200';
    case 'Drainage Department':
      return 'bg-teal-50 text-teal-900 border-teal-200';
    case 'Traffic Department':
      return 'bg-rose-50 text-rose-900 border-rose-200';
    case 'Public Works':
    default:
      return 'bg-slate-50 text-slate-900 border-slate-200';
  }
}
