export const ATTIRE_CATALOG = [
  { id: 'suit_black', name: 'Black Formal Suit', category: 'Male', color: '#111827', collarType: 'V-Neck Lapel' },
  { id: 'suit_navy', name: 'Navy Blue Blazer', category: 'Male', color: '#1e3a8a', collarType: 'Notch Lapel' },
  { id: 'blazer_grey', name: 'Charcoal Grey Suit', category: 'Male', color: '#374151', collarType: 'Peak Lapel' },
  { id: 'women_blazer_black', name: 'Women Executive Blazer', category: 'Female', color: '#18181b', collarType: 'Button Lapel' },
  { id: 'women_suit_navy', name: 'Women Navy Business Jacket', category: 'Female', color: '#172554', collarType: 'Open Collar' }
];

export function filterAttireByCategory(category) {
  if (!category || category === 'All') return ATTIRE_CATALOG;
  return ATTIRE_CATALOG.filter((item) => item.category.toLowerCase() === category.toLowerCase());
}
