/**
 * Formats a date string or Date object to "DD MMM, ddd" format (e.g., "21 Apr, Sun").
 * @param dateInput - The date to format (string or Date)
 * @returns Formatted date string
 */
export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date?.getTime())) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
