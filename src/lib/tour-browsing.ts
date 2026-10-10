import { tours, type Tour } from '@/lib/tours';

export const holidayThemes = [
  { value: 'christmas', label: 'Christmas', description: 'A festive escape to end the year beautifully.' },
  { value: 'diwali', label: 'Diwali', description: 'Trade the everyday for a memorable festive break.' },
  { value: 'honeymoon', label: 'Honeymoon', description: 'A new chapter, somewhere extraordinary.' },
  { value: 'family', label: 'Family', description: 'More time together. More moments to remember.' },
  { value: 'adventure', label: 'Adventure', description: 'Fresh perspectives, wild landscapes and open skies.' },
  { value: 'beach', label: 'Beach', description: 'Slow mornings and a little more ocean.' },
] as const;
export const categories = [{ value: 'all', label: 'All tours' }, { value: 'domestic', label: 'Domestic' }, { value: 'international', label: 'International' }];
const themeAssignments: Record<string, string[]> = {
  'bali-bliss': ['honeymoon', 'beach', 'adventure'], 'kashmir-paradise': ['family', 'adventure'],
  'dubai-delights': ['family', 'adventure'], 'maldives-escape': ['honeymoon', 'beach'],
  'kerala-serenity': ['honeymoon', 'family'], 'swiss-dreams': ['honeymoon', 'adventure'],
  'goa-coastal-break': ['beach', 'family'], 'rajasthan-royal-trail': ['family'],
  'thailand-island-trails': ['beach', 'adventure'], 'singapore-city-escape': ['family'],
  'manali-mountain-retreat': ['adventure', 'honeymoon'], 'vietnam-discovery': ['adventure', 'family'],
};
function themedPackage(base: Tour, slug: string, name: string, theme: string, description: string): Tour {
  themeAssignments[slug] = [theme];
  return { ...base, slug, name, tag: `${theme.charAt(0).toUpperCase()}${theme.slice(1)} special`, description, highlights: [...base.highlights], itinerary: [...base.itinerary] };
}
const festivePackages = [
  themedPackage(tours[0], 'bali-honeymoon', 'Bali Honeymoon Escape', 'honeymoon', 'Celebrate your new chapter with peaceful Ubud mornings and a relaxed coastal stay. Romantic extras can be arranged and quoted separately.'),
  themedPackage(tours[3], 'maldives-honeymoon', 'Maldives Honeymoon Retreat', 'honeymoon', 'A romantic island escape for two, with lagoon views and plenty of time together. Room upgrades and private dining are optional additions.'),
  themedPackage(tours[5], 'swiss-christmas', 'Swiss Christmas Getaway', 'christmas', 'Discover alpine scenery and festive city atmosphere during a Christmas-season escape. Seasonal markets, snow and activities depend on your exact dates and weather.'),
  themedPackage(tours[2], 'dubai-christmas', 'Dubai Christmas City Break', 'christmas', 'Make your year-end break a mix of skyline views, desert adventure and holiday shopping. Festive events and venue tickets are confirmed separately.'),
  themedPackage(tours[4], 'kerala-diwali', 'Kerala Diwali Family Escape', 'diwali', 'Spend your Diwali holidays together among tea gardens and peaceful backwaters. A relaxed festive-season itinerary, with no specific celebration or event guaranteed.'),
  themedPackage(tours[1], 'kashmir-diwali', 'Kashmir Diwali Valley Break', 'diwali', 'Take a festive family break in Kashmir, with lake views, valley excursions and time to unwind. Sightseeing is subject to weather and local conditions.'),
];
export const allTours: Tour[] = [...tours, ...festivePackages];
export function destinationOf(tour: Tour) { return tour.country.split(',')[0]?.trim() ?? tour.country; }
export const destinations = [...new Set(allTours.map(destinationOf))].sort();
export function filterTours({ category = 'all', destination = 'all', theme = 'all', query = '' }: { category?: string; destination?: string; theme?: string; query?: string } = {}) {
  return allTours.filter(t => (category === 'all' || t.category === category) && (destination === 'all' || destinationOf(t) === destination) && (theme === 'all' || themeAssignments[t.slug]?.includes(theme)) && `${t.country} ${t.name} ${t.highlights.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
}