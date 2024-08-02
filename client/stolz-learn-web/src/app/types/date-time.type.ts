import { formatDate } from '@angular/common';

const dateTimeRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export type DateTime = (
  | `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
  | `${number}-${number}-${number}T${number}:${number}:${number}.${number}+${number}:${number}`
) &
  (
    | `${string}-${string}-${string}T${string}:${string}:${string}.${string}Z`
    | `${string}-${string}-${string}T${string}:${string}:${string}.${string}+${string}:${string}`
  );

const fromDayMonthYear = (day: string, month: string, year: string) => {
  const time = new Date();
  // Check if year has only 2 digits ( e.g. 23 ) if so, add current year to it => 2023
  if (year.length === 2) {
    const currentYear = new Date().getFullYear().toString();
    time.setUTCFullYear(
      parseInt(currentYear.slice(0, 2) + year),
      parseInt(month) - 1,
      parseInt(day),
    );
  } else
    time.setUTCFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
  return time.toISOString() as DateTime;
};

export const DateTime = {
  now: () => {
    return new Date().toISOString() as DateTime;
  },
  toDate: (anyDateFormat: string): Date => {
    anyDateFormat = DateTime.toDateTime(anyDateFormat);
    const clientDate = formatDate(
      new Date(anyDateFormat.toString()),
      'yyyy-MM-dd',
      'en-UK',
    );
    return new Date(clientDate);
  },
  toStartOfDay: (date: DateTime) => {
    return (date.split('T')[0] + 'T00:00:00.000Z') as DateTime;
  },
  toEndOfDay: (date: DateTime) => {
    return (date.split('T')[0] + 'T23:59:59.999Z') as DateTime;
  },
  toDateTime(anyDateFormat: string) {
    if (anyDateFormat.match(dateTimeRegex)) return anyDateFormat as DateTime;
    const [day, month, year] = anyDateFormat.split('.');
    return fromDayMonthYear(day, month, year);
  },
  toDateTimeOrDefault(anyDateFormat: string | undefined): DateTime | undefined {
    if (!anyDateFormat) return undefined;
    if (anyDateFormat.match(dateTimeRegex)) return anyDateFormat as DateTime;
    const [day, month, year] = anyDateFormat.split('.');
    if (!day || !month || !year) return undefined;
    return fromDayMonthYear(day, month, year);
  },
  toClientDate: (anyDateFormat: string, withTime?: boolean) => {
    if (!anyDateFormat) return '';
    anyDateFormat = DateTime.toDateTime(anyDateFormat);
    return formatDate(
      new Date(anyDateFormat.toString()),
      'dd.MM.yy' + (withTime ? ' HH:mm' : ''),
      'en-UK',
    );
  },
  isDateTime: (anyDateFormat: string) => {
    return !!anyDateFormat.match(dateTimeRegex);
  },
  toMs: (date: DateTime) => {
    return new Date(date).getTime();
  },
  diff: (
    date1: DateTime,
    date2: DateTime,
    format:
      | 'milliseconds'
      | 'seconds'
      | 'minutes'
      | 'hours'
      | 'days'
      | 'months'
      | 'years',
  ) => {
    const diff = new Date(date2).getTime() - new Date(date1).getTime();
    switch (format) {
      case 'milliseconds':
        return diff;
      case 'seconds':
        return diff / 1000;
      case 'minutes':
        return diff / 1000 / 60;
      case 'hours':
        return diff / 1000 / 60 / 60;
      case 'days':
        return diff / 1000 / 60 / 60 / 24;
      case 'months':
        return diff / 1000 / 60 / 60 / 24 / 30;
      case 'years':
        return diff / 1000 / 60 / 60 / 24 / 365;
    }
  },
  addDays: (date: DateTime, days: number) => {
    const dateMs = DateTime.toMs(date);
    return new Date(
      dateMs + days * 24 * 60 * 60 * 1000,
    ).toISOString() as DateTime;
  },
  format: (date: DateTime, format: string) => {
    return formatDate(new Date(date.toString()), format, 'en-UK');
  },
  toMilliseconds: (date: DateTime) => {
    return new Date(date).getTime();
  },
};
