import { describe, expect, it } from 'vitest';
import { filterTours } from '@/lib/tour-browsing';
import { defaultPackageFilters, filterPackages } from '@/lib/package-filters';

const kashmir = filterTours({ destination: 'Kashmir' });
describe('Destination package filters', () => {
  it('filters Group Tour packages within Kashmir', () => {
    expect(filterPackages(kashmir, { ...defaultPackageFilters, tourType: 'group' }).map(t => t.slug)).toEqual(['kashmir-diwali']);
  });
  it('filters FIT Tour packages within Kashmir', () => {
    expect(filterPackages(kashmir, { ...defaultPackageFilters, tourType: 'fit' }).map(t => t.slug)).toEqual(['kashmir-paradise']);
  });
  it('applies both ends of the money range inclusively', () => {
    expect(filterPackages(kashmir, { ...defaultPackageFilters, minPrice: 24999, maxPrice: 24999 })).toHaveLength(2);
    expect(filterPackages(kashmir, { ...defaultPackageFilters, minPrice: 25000 })).toEqual([]);
    expect(filterPackages(kashmir, { ...defaultPackageFilters, maxPrice: 24998 })).toEqual([]);
  });
  it('matches fixed group departure dates inside the selected range', () => {
    expect(filterPackages(kashmir, { ...defaultPackageFilters, tourType: 'group', departureFrom: '2026-11-08', departureTo: '2026-11-08' }).map(t => t.slug)).toEqual(['kashmir-diwali']);
    expect(filterPackages(kashmir, { ...defaultPackageFilters, tourType: 'group', departureFrom: '2026-12-01', departureTo: '2026-12-31' })).toEqual([]);
  });
  it('matches flexible FIT dates without pretending they are fixed departures', () => {
    expect(filterPackages(kashmir, { ...defaultPackageFilters, tourType: 'fit', departureFrom: '2026-12-01', departureTo: '2026-12-31' }).map(t => t.slug)).toEqual(['kashmir-paradise']);
  });
  it('rejects reversed date or budget ranges', () => {
    expect(filterPackages(kashmir, { ...defaultPackageFilters, departureFrom: '2026-12-01', departureTo: '2026-11-01' })).toEqual([]);
    expect(filterPackages(kashmir, { ...defaultPackageFilters, minPrice: 30000, maxPrice: 20000 })).toEqual([]);
  });
  it('keeps the destination after resetting package filters', () => {
    expect(filterPackages(kashmir, defaultPackageFilters).map(t => t.slug)).toEqual(['kashmir-paradise', 'kashmir-diwali']);
  });
});

describe('Domestic and international listing filters', () => {
  const domestic = filterTours({ category: 'domestic' });
  const international = filterTours({ category: 'international' });
  it('seeds the listing with Group and FIT tours in the category', () => {
    expect(filterPackages(domestic, defaultPackageFilters).length).toBeGreaterThan(0);
    expect(filterPackages(international, defaultPackageFilters).length).toBeGreaterThan(0);
  });
  it('filters group departures inside the domestic category', () => {
    expect(filterPackages(domestic, { ...defaultPackageFilters, tourType: 'group' }).every(t => ['kashmir-diwali', 'kerala-diwali', 'rajasthan-royal-trail'].includes(t.slug))).toBe(true);
  });
  it('matches the same packages whether reached by category or destination', () => {
    const viaCategory = filterPackages(filterTours({ category: 'domestic', destination: 'Kashmir' }), { ...defaultPackageFilters, tourType: 'group' });
    expect(viaCategory.map(t => t.slug)).toEqual(['kashmir-diwali']);
  });
});