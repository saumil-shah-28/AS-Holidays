import { format, parseISO } from 'date-fns';
import { CalendarIcon, SlidersHorizontal, Users, UserRound, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultPackageFilters, type PackageFilters as Filters } from '@/lib/package-filters';
import { money } from '@/lib/tours';

function DepartureDate({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="package-filter-field"><span>{label}</span><Popover><PopoverTrigger asChild><Button aria-label={label} variant="outline" className="justify-start font-normal"><CalendarIcon />{value ? format(parseISO(value), 'dd MMM yyyy') : 'Any date'}</Button></PopoverTrigger><PopoverContent align="start" className="w-auto p-0 pointer-events-auto"><Calendar mode="single" selected={value ? parseISO(value) : undefined} defaultMonth={value ? parseISO(value) : new Date(2026, 9, 1)} onSelect={date => onChange(date ? format(date, 'yyyy-MM-dd') : '')} className="p-3 pointer-events-auto" /><Button variant="ghost" size="sm" className="m-2" onClick={() => onChange('')}>Clear date</Button></PopoverContent></Popover></div>;
}
export function PackageFilters({ value, onChange }: { value: Filters; onChange: (next: Filters) => void }) {
  const update = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  const active = Object.keys(defaultPackageFilters).some(key => value[key as keyof Filters] !== defaultPackageFilters[key as keyof Filters]);
  return <div className="package-filters"><div className="package-filter-heading"><span><SlidersHorizontal size={17} />Refine your trip</span><Button variant="ghost" size="sm" disabled={!active} onClick={() => onChange({ ...defaultPackageFilters })}><RotateCcw size={14} />Reset filters</Button></div>
    <div className="package-filter-grid"><div className="package-filter-field"><span>Tour type</span><div className="package-type-options" role="group" aria-label="Tour type">{[{ value: 'all', label: 'All' }, { value: 'group', label: 'Group Tour', icon: Users }, { value: 'fit', label: 'FIT Tour', icon: UserRound }].map(option => <Button key={option.value} size="sm" variant={value.tourType === option.value ? 'default' : 'outline'} aria-pressed={value.tourType === option.value} onClick={() => update({ tourType: option.value })}>{option.icon && <option.icon />}{option.label}</Button>)}</div></div>
      <div className="package-filter-field"><span>Budget per person · INR</span><div className="package-budget-inputs"><Input type="number" min={0} aria-label="Minimum budget" value={value.minPrice} onChange={e => update({ minPrice: Math.max(0, Number(e.target.value)) })} /><span>—</span><Input type="number" min={0} aria-label="Maximum budget" value={value.maxPrice} onChange={e => update({ maxPrice: Math.max(0, Number(e.target.value)) })} /></div><small>{money(value.minPrice)} – {money(value.maxPrice)}</small></div>
      <DepartureDate label="Departure from" value={value.departureFrom} onChange={departureFrom => update({ departureFrom })} /><DepartureDate label="Departure until" value={value.departureTo} onChange={departureTo => update({ departureTo })} />
      <div className="package-filter-field"><span>Duration</span><Select value={value.duration} onValueChange={duration => update({ duration })}><SelectTrigger aria-label="Filter by duration"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All durations</SelectItem><SelectItem value="short">Up to 5 days</SelectItem><SelectItem value="long">6 days or more</SelectItem></SelectContent></Select></div>
      <div className="package-filter-field"><span>Sort by</span><Select value={value.sort} onValueChange={sort => update({ sort })}><SelectTrigger aria-label="Sort packages"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="recommended">Recommended</SelectItem><SelectItem value="low">Price: low to high</SelectItem><SelectItem value="high">Price: high to low</SelectItem></SelectContent></Select></div>
    </div>{value.minPrice > value.maxPrice && <p className="text-sm text-destructive mt-3">Minimum budget must not exceed maximum budget.</p>}{value.departureFrom && value.departureTo && value.departureFrom > value.departureTo && <p className="text-sm text-destructive mt-3">Departure until must be on or after departure from.</p>}
  </div>;
}