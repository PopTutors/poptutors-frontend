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

export function getCurrencySymbol(currency: string): string {
  // A simple mapping for common currencies
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    RUB: '₽',
    KRW: '₩',
    NGN: '₦',
    ZAR: 'R',
    SGD: 'S$',
    HKD: 'HK$',
    BRL: 'R$',
    MXN: '$',
    TRY: '₺',
    AED: 'د.إ',
    SAR: '﷼',
    IDR: 'Rp',
    THB: '฿',
    PHP: '₱',
    PLN: 'zł',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    MYR: 'RM',
    // Add more as needed
  };
  // Try uppercase for robustness
  return symbols[currency.toUpperCase()] || currency;
}
