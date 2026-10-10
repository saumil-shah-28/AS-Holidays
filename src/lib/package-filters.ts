import type { Tour } from '@/lib/tours';

export type PackageFilters = { tourType: string; minPrice: number; maxPrice: number; departureFrom: string; departureTo: string; duration: string; sort: string };
export const defaultPackageFilters: PackageFilters = { tourType: 'all', minPrice: 0, maxPrice: 150000, departureFrom: '', departureTo: '', duration: 'all', sort: 'recommended' };
// Illustrative travel starts only; these are not confirmed departures.
const groupDepartures: Record<string, string[]> = {
  'kashmir-diwali': ['2026-11-05', '2026-11-08', '2026-11-12'],
  'kerala-diwali': ['2026-11-06', '2026-11-10'],
  'swiss-christmas': ['2026-12-20', '2026-12-24', '2026-12-28'],
  'dubai-christmas': ['2026-12-22', '2026-12-25', '2026-12-29'],
  'rajasthan-royal-trail': ['2026-11-15', '2026-12-15', '2027-01-15'],
  'vietnam-discovery': ['2026-11-18', '2026-12-18', '2027-01-18'],
};
export function packageSchedule(tour: Tour) {
  const dates = groupDepartures[tour.slug];
  return dates ? { tourType: 'group' as const, departures: dates, flexibleFrom: '', flexibleTo: '' }
    : { tourType: 'fit' as const, departures: [], flexibleFrom: '2026-10-10', flexibleTo: '2027-12-31' };
}
export function filterPackages(tours: Tour[], filters: PackageFilters): Tour[] {
  const { tourType, minPrice, maxPrice, departureFrom, departureTo, duration, sort } = filters;
  return tours.filter(tour => {
    const schedule = packageSchedule(tour);
    const datesMatch = schedule.tourType === 'group'
      ? schedule.departures.some(date => (!departureFrom || date >= departureFrom) && (!departureTo || date <= departureTo))
      : (!departureFrom || schedule.flexibleTo >= departureFrom) && (!departureTo || schedule.flexibleFrom <= departureTo);
    return (tourType === 'all' || schedule.tourType === tourType) && tour.price >= minPrice && tour.price <= maxPrice
      && (!departureFrom || !departureTo || departureFrom <= departureTo) && datesMatch
      && (duration === 'all' || (duration === 'short' ? tour.days <= 5 : tour.days >= 6));
  }).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0);
}