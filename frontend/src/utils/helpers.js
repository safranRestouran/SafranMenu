export function formatPrice(price) {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function truncate(str, len = 80) {
  return str?.length > len ? str.substring(0, len) + '...' : str;
}

export function getImageUrl(url) {
  if (!url) return '/placeholder.svg';
  if (url.startsWith('http')) return url;
  return url;
}
