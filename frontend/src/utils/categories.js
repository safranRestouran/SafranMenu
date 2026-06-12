export const CATEGORIES = [
  { id: 'mangal', label: 'Mangal', icon: '🔥', color: '#D4AF37' },
  { id: 'milliy-taomlar', label: 'Milliy Taomlar', icon: '🍲', color: '#D4AF37' },
  { id: 'ichimliklar', label: 'Ichimliklar', icon: '🥤', color: '#D4AF37' },
  { id: 'shirinliklar', label: 'Shirinliklar', icon: '🍰', color: '#D4AF37' },
  { id: 'salatlar', label: 'Salatlar', icon: '🥗', color: '#D4AF37' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
