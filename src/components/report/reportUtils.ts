import { Report, ReportState } from './ReportTypes';

export const priorityTranslations: Record<string, string> = {
  High: 'بالا',
  Medium: 'متوسط',
  Low: 'پایین'
};

export const priorityColors: Record<string, string> = {
  High: 'bg-red-500',
  Medium: 'bg-blue-500',
  Low: 'bg-green-500'
};

export const approvalStatusTranslations: Record<number, string> = {
  0: 'در انتظار بررسی',
  1: 'تایید شده',
  2: 'رد شده'
};

export const statusTranslations: Record<number, string> = {
  0: 'شروع نشده',
  1: 'در حال انجام',
  2: 'کامل شده'
};

export const reportOpennessTranslations: Record<ReportState, string> = {
  'not-approved': 'باز',
  'approved-unresolved': 'باز',
  'approved-resolved': 'بسته',
  'denied': 'بسته',
  'unknown': 'نامشخص'
};

export const formatReportDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getReportState = (report: Report) => {
  if (report.approvalStatus === 0) return 'not-approved';
  if (report.approvalStatus === 1 && report.status === 0) return 'approved-unresolved';
  if (report.approvalStatus === 1 && report.status === 1) return 'approved-resolved';
  if (report.approvalStatus === 2) return 'denied';
  return 'unknown';
};
