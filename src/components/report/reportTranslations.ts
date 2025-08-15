export const priorityTranslations: Record<string, string> = {
  High: 'بالا',
  Medium: 'متوسط',
  Low: 'پایین'
};

export const priorityColors: Record<string, string> = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
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

export const reportStatusTranslations: Record<number, string> = {
  0: 'بسته',
  1: 'باز'
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
