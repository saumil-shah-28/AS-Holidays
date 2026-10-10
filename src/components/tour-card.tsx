import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Clock3, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { money, type Tour } from '@/lib/tours';
import { packageSchedule } from '@/lib/package-filters';
import { format, parseISO } from 'date-fns';

export function TourCard({ tour, showSchedule = false }: { tour: Tour; showSchedule?: boolean }) {
  const schedule = packageSchedule(tour);
  return <article className="tour-card group">
    <Link to="/tours/$slug" params={{ slug: tour.slug }} className="tour-photo" aria-label={`Explore ${tour.name}`}><img src={tour.image} alt={tour.country} loading="lazy" /><span className="tour-tag">{tour.tag}</span><span className="tour-duration"><Clock3 size={13} /> {tour.days} days / {tour.days - 1} nights</span></Link>
    <div className="tour-card-body"><p className="location"><MapPin size={13} />{tour.country}</p><Link to="/tours/$slug" params={{ slug: tour.slug }}><h3>{tour.name}</h3></Link><p className="card-inclusions"><Check size={13} /> Stays <span>·</span> Transfers <span>·</span> Sightseeing</p><>{showSchedule && <div className="package-schedule">{schedule.tourType === 'group' ? 'Group Tour' : 'FIT Tour · Private trip'}<small>{schedule.tourType === 'group' ? `Sample departures: ${schedule.departures.map(date => format(parseISO(date), 'dd MMM yyyy')).join(' · ')}` : 'Flexible departure dates · On enquiry'}</small></div>}</><div className="card-bottom"><div><span className="price-label">Starting from</span><p className="tour-price">{money(tour.price)} <span>/ person</span></p></div><Button variant="outline" size="icon" asChild><Link to="/tours/$slug" params={{ slug: tour.slug }} aria-label={`View ${tour.name}`}><ArrowUpRight /></Link></Button></div></div>
  </article>;
}