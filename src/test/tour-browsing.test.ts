import { describe, it, expect } from 'vitest';
import { allTours, destinations, filterTours } from '@/lib/tour-browsing';
describe('Holiday collections', () => {
  it('filters domestic and international categories separately', () => {
    expect(filterTours({ category: 'domestic' }).map(t => t.category)).not.toContain('international');
    expect(filterTours({ category: 'international' }).map(t => t.slug)).toContain('singapore-city-escape');
  });
  it('groups packages by destination', () => {
    expect(filterTours({ destination: 'Bali' }).map(t => t.slug)).toEqual(['bali-bliss', 'bali-honeymoon']);
  });
  it('has Christmas packages', () => {
    expect(filterTours({ theme: 'christmas' }).map(t => t.slug)).toEqual(['swiss-christmas', 'dubai-christmas']);
  });
  it('has Diwali packages', () => {
    expect(filterTours({ theme: 'diwali' }).map(t => t.slug)).toEqual(['kerala-diwali', 'kashmir-diwali']);
  });
  it('combines honeymoon and destination filters', () => {
    expect(filterTours({ theme: 'honeymoon', destination: 'Maldives' }).map(t => t.slug)).toEqual(['maldives-escape', 'maldives-honeymoon']);
  });
  it('adds new destinations and complete unique packages', () => {
    expect(destinations).toEqual(expect.arrayContaining(['Goa', 'Rajasthan', 'Thailand', 'Singapore', 'Himachal Pradesh', 'Vietnam']));
    expect(allTours).toHaveLength(18);
    expect(new Set(allTours.map(t => t.slug)).size).toBe(18);
    for (const tour of allTours) expect(tour.itinerary).toHaveLength(tour.days);
  });
});