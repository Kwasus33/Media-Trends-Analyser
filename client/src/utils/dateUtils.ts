export function getISODate(date: Date) {
  return date.toISOString().split('T')[0];
}
