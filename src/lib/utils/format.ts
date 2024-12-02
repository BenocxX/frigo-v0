import { formatDate, formatDistance } from 'date-fns';
import { frCA } from 'date-fns/locale';

export function formatCurrency(value: number) {
  return Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(value);
}

export function formatDatePPP(date: Date) {
  return formatDate(date, 'PPP', {
    locale: frCA,
  });
}

export function formatTimeBetween(date1: Date, date2: Date = new Date()) {
  return formatDistance(date1, date2, {
    locale: frCA,
  });
}
