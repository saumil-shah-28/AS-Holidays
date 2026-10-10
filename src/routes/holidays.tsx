import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TourCard } from '@/components/tour-card';
import { TourBrowser, type BrowseSelection } from '@/components/tour-browser';
import { filterTours, holidayThemes } from '@/lib/tour-browsing';
import { pageHead, tours } from '@/lib/tours';
import { PackageFilters } from '@/components/package-filters';
import { defaultPackageFilters, filterPackages } from '@/lib/package-filters';

export const Route = createFileRoute('/holidays')({ validateSearch: (s: Record<string, unknown>): { theme?: string | undefined; destination?: string | undefined; category?: string | undefined } => ({ theme: typeof s['theme'] === 'string' ? s['theme'] : undefined, destination: typeof s['destination'] === 'string' ? s['destination'] : undefined, category: typeof s['category'] === 'string' ? s['category'] : undefined }), head: () => pageHead('Holiday collections — Destinations & themes', 'Browse AS Holidays by destination, domestic or international category, Christmas, Diwali, honeymoon, family, beach or adventure.'), component: Holidays });
function Holidays() {
  const search = Route.useSearch();
  const [packageFilters, setPackageFilters] = useState({ ...defaultPackageFilters });
  useEffect(() => { setPackageFilters({ ...defaultPackageFilters }); }, [search.destination, search.theme, search.category]);
  const [selection, setSelection] = useState<BrowseSelection>({ category: search.category ?? 'all', destination: search.destination ?? 'all', theme: search.theme ?? 'all' });
  useEffect(() => { setSelection({ category: search.category ?? 'all', destination: search.destination ?? 'all', theme: search.theme ?? 'all' }); }, [search.category, search.destination, search.theme]);
  const selectedTheme = holidayThemes.find(t => t.value === selection.theme);
  const isDestination = selection.destination !== 'all';
  const filtered = isDestination ? filterPackages(filterTours(selection), packageFilters) : filterTours(selection);
  return <><section className="listing-hero"><img src={tours[5].image} alt="Swiss alpine lake and mountains" /><div className="hero-shade" /><div className="site-container"><p className="eyebrow">A HOLIDAY FOR EVERY KIND OF YOU</p><h1>{selectedTheme ? `${selectedTheme.label} holidays.` : 'Find your perfect escape.'}</h1><p>{selectedTheme?.description ?? 'Discover destinations, festive breaks and journeys made for your favourite people.'}</p></div></section><section className="site-container listing-section"><div className="section-heading"><div><p className="eyebrow">CURATED HOLIDAY COLLECTIONS</p><h2>{selection.destination !== 'all' ? `Explore ${selection.destination}.` : 'Where will your story take you?'}</h2></div><span className="result-count">{filtered.length} packages</span></div><>{isDestination ? <PackageFilters value={packageFilters} onChange={setPackageFilters} /> : <TourBrowser selection={selection} onChange={setSelection} />}</><div className="tour-grid listing-grid">{filtered.map(t => <TourCard key={t.slug} tour={t} showSchedule={isDestination} />)}</div>{!filtered.length && <div className="empty-state"><h3>No trips match this combination.</h3><p>Try another tour type, budget or departure range.</p><Button variant="outline" onClick={() => isDestination ? setPackageFilters({ ...defaultPackageFilters }) : setSelection({ category: 'all', destination: 'all', theme: 'all' })}>{isDestination ? 'Reset filters' : 'Show all holidays'}</Button></div>}<p className="prototype-note">Package types, prices and departure dates are illustrative samples. FIT tours are private, customized trips with flexible dates; group tours show sample fixed departures. Actual availability, dates, inclusions and final quotes are confirmed on enquiry.</p></section></>;
}