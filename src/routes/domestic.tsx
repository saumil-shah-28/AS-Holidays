import { createFileRoute } from '@tanstack/react-router';
import { TourListing } from '@/components/tour-listing';
import { pageHead } from '@/lib/tours';
export const Route = createFileRoute('/domestic')({ validateSearch: (search: Record<string, unknown>): { q?: string | undefined; month?: string | undefined } => ({ q: typeof search['q'] === 'string' ? search['q'] : undefined, month: typeof search['month'] === 'string' ? search['month'] : undefined }), head: () => pageHead('Domestic tours — Discover India', 'Explore Kashmir, Kerala and customized domestic holidays with AS Holidays in Ahmedabad.'), component: DomesticPage });
function DomesticPage() { const search = Route.useSearch(); return <TourListing category="domestic" initialQuery={search.q ?? ''} month={search.month ?? ''} />; }