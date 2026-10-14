/**
 * Date utility functions using local time zone so midnight rollover behaves correctly.
 */

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function formatDateDisplay(dateStr: string, options: { short?: boolean; includeYear?: boolean } = {}): string {
  try {
    const date = parseLocalDate(dateStr);
    if (options.short) {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: options.includeYear ? 'numeric' : undefined,
    });
  } catch {
    return dateStr;
  }
}

export function formatTimeDisplay(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function formatDateTimeDisplay(timestamp: number): string {
  try {
    const d = new Date(timestamp);
    const datePart = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const timePart = d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${datePart} at ${timePart}`;
  } catch {
    return '';
  }
}

export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getTimeGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 23 || hour < 5) {
    return 'Still up?';
  }
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

export function isPastTime(timeStr: string, now: Date = new Date()): boolean {
  if (!timeStr || !timeStr.includes(':')) return false;
  const [targetHour, targetMinute] = timeStr.split(':').map(Number);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (currentHour > targetHour) return true;
  if (currentHour === targetHour && currentMinute >= targetMinute) return true;
  return false;
}

export function getPastDates(days: number, endDate: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    dates.push(getLocalDateString(d));
  }
  return dates;
}

export function getDaysShownUpCount(dates: string[], monthYear: { year: number; month: number }): number {
  const monthStr = String(monthYear.month + 1).padStart(2, '0');
  const prefix = `${monthYear.year}-${monthStr}`;
  const distinct = new Set(dates.filter((d) => d.startsWith(prefix)));
  return distinct.size;
}
