import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, ChevronDown, Compass, Globe2, HeartHandshake, MapPin, Search, ShieldCheck, SlidersHorizontal, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TourCard } from '@/components/tour-card';
import { TourBrowser, defaultSelection } from '@/components/tour-browser';
import { filterTours, destinations } from '@/lib/tour-browsing';
import { pageHead, tours } from '@/lib/tours';
import { media } from '@/lib/media';

export const Route = createFileRoute('/')({ head: () => pageHead('Holidays worth remembering', 'Explore customized domestic and international holidays with AS Holidays, your travel partner in Ahmedabad.'), component: Index });

function Index() {
  const [selection, setSelection] = useState(defaultSelection);
  const [destination, setDestination] = useState('');
  const [month, setMonth] = useState('');
  const [kind, setKind] = useState('');
  const bannerVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const film = bannerVideo.current;
    if (!film) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (motion.matches || document.hidden) film.pause();
      else void film.play().catch(() => {});
    };
    updatePlayback();
    motion.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      motion.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
      film.pause();
    };
  }, []);
  const navigate = useNavigate();
  const displayed = filterTours(selection).slice(0, 8);
  const findTours = (e: React.FormEvent) => { e.preventDefault(); const category = kind === 'domestic' || tours.some(t => t.category === 'domestic' && t.country.toLowerCase().includes(destination.toLowerCase()) && destination.length > 0) ? '/domestic' : '/international'; navigate({ to: category, search: { q: destination, month } }); };
  return <>
    <section className="home-hero"><img className="hero-image" src={media.bali} alt="Ulun Danu Beratan temple on a tranquil lake in Bali, Indonesia" fetchPriority="high" /><video ref={bannerVideo} className="hero-image hero-background-video" poster={media.bali} autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src={media.baliBannerWebm} type="video/webm" /><source src={media.baliBannerMp4} type="video/mp4" onError={e => { const v = e.currentTarget.parentElement; if (v) v.hidden = true; }} /></video><div className="hero-shade" /><div className="site-container hero-content"><span className="hero-eyebrow"><span /> YOUR WORLD. YOUR WAY.</span><h1>AS Holidays<span>A world of journeys.<br />A lifetime of memories.</span></h1><p>From India’s hidden gems to the world’s wonders,<br className="desktop-break" /> we turn your travel dreams into beautifully planned holidays.</p><div className="hero-buttons"><Button asChild size="lg" variant="hero"><Link to="/international">Explore our tours <ArrowUpRight /></Link></Button></div><div className="hero-review"><span className="review-avatars"><img src={tours[3].image} alt="Island holiday" /><img src={tours[1].image} alt="Mountain holiday" /><img src={tours[2].image} alt="City holiday" /></span><div><div className="stars">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill="currentColor" />)}</div><p><strong>4.8/5</strong> · Loved by our travellers on Google</p></div></div></div><div className="hero-place"><MapPin size={15} /><div><strong>Besakih Temple, Bali</strong><span>Your next story could start here.</span></div></div></section>
    <div className="site-container search-wrapper"><form className="trip-search" onSubmit={findTours}><div className="search-field"><MapPin /><label htmlFor="destination">Where to?<input id="destination" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Your dream destination" list="destinations" /></label><datalist id="destinations">{destinations.map(d => <option key={d} value={d} />)}</datalist><ChevronDown size={15} /></div><div className="search-field"><CalendarDays /><label htmlFor="month">When?<select id="month" value={month} onChange={e => setMonth(e.target.value)}><option value="">Choose your month</option>{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m}>{m}</option>)}</select></label><ChevronDown size={15} /></div><div className="search-field"><Globe2 /><label htmlFor="tour-type">Your kind of holiday<select id="tour-type" value={kind} onChange={e => setKind(e.target.value)}><option value="">All experiences</option><option value="domestic">Domestic tours</option><option value="international">International tours</option></select></label><ChevronDown size={15} /></div><Button type="submit" size="lg"><Search /> Find my holiday</Button></form></div>
    <div className="site-container trust-row"><span><BadgeCheck /> Thoughtfully curated trips</span><span><SlidersHorizontal /> Tailored to your budget</span><span><HeartHandshake /> Personal travel assistance</span><span><ShieldCheck /> Travel with peace of mind</span></div>
    <section className="site-container popular-section"><div className="section-heading"><div><p className="eyebrow">FIND YOUR NEXT ADVENTURE</p><h2>Away from ordinary.</h2><p>Handpicked holidays. Extraordinary places. All you have to do is go.</p></div><Button asChild variant="link"><Link to="/holidays" search={{ category: selection.category, destination: selection.destination, theme: selection.theme }}>View all tours <ArrowUpRight /></Link></Button></div><TourBrowser selection={selection} onChange={setSelection} /><div className="tour-grid home-tour-grid">{displayed.map(t => <TourCard key={t.slug} tour={t} />)}</div>{!displayed.length && <div className="empty-state"><h3>No trips match this combination.</h3><Button variant="outline" onClick={() => setSelection(defaultSelection)}>Show all holidays</Button></div>}</section>
    <section className="destination-band"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">SO MANY PLACES. SO MANY POSSIBILITIES.</p><h2>Follow your kind of feeling.</h2></div><p>Mountains or beaches? A little of both?</p></div><div className="feeling-grid">{[{ tour: tours[1], label: 'Into the mountains', sub: 'Fresh air. A fresh perspective.' }, { tour: tours[3], label: 'By the sea', sub: 'Less rush. More ocean.' }, { tour: tours[2], label: 'Beyond the everyday', sub: 'New cities. New stories.' }].map(({ tour, label, sub }) => <Link key={label} to="/tours/$slug" params={{ slug: tour.slug }} className="feeling-card"><img src={tour.image} alt={tour.country} loading="lazy" /><div><h3>{label}</h3><p>{sub}</p></div><ArrowUpRight /></Link>)}</div></div></section>
    <section className="site-container story-section"><div className="story-images"><img src={tours[4].image} alt="Peaceful palm-lined Kerala backwaters" loading="lazy" /><span className="story-stamp"><Compass size={30} /><strong>Less planning.<br />More living.</strong></span></div><div className="story-copy"><p className="eyebrow">A TRAVEL PARTNER, NOT JUST AN AGENCY</p><h2>We plan the details.<br />You make the memories.</h2><p>At AS Holidays, we believe the best trips are the ones that feel like you. A family getaway, a romantic escape, or an adventure with friends — we listen, plan, and bring it all together.</p><p>From our home in Ahmedabad to wherever your heart wants to go, we’re here to make your journey personal, comfortable, and unforgettable.</p><Button asChild variant="outline" size="lg"><Link to="/about">Get to know us <ArrowUpRight /></Link></Button></div></section>
    <section className="reviews-band"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">GOOD TRIPS. HAPPY PEOPLE.</p><h2>Memories, in their own words.</h2></div><a className="google-rating" href="https://www.google.com/maps/search/?api=1&query=AS+Holidays+Ahmedabad" target="_blank" rel="noreferrer"><span className="google-g">G</span><span><strong>4.8 <Star size={15} fill="currentColor" /></strong><small>Google reviews</small></span></a></div><div className="review-grid">{['The hotels provided were clean, comfortable, and served good food.', 'Overall had a very good experience with outstanding facilities.', 'The entire trip was very well organized, and we enjoyed every moment.'].map((text, i) => <article className="review-card" key={text}><div className="stars">{Array.from({ length: 5 }, (_, n) => <Star key={n} size={14} fill="currentColor" />)}</div><blockquote>“{text}”</blockquote><p><span className="review-initial">{['A', 'S', 'R'][i]}</span><span>AS Holidays traveller<small>Shared on Google</small></span><BadgeCheck size={16} /></p></article>)}</div></div></section>
    <section className="cta-band"><div className="site-container"><div><p className="eyebrow">LET’S MAKE YOUR SOMEDAY, TODAY.</p><h2>Where do you want to go next?</h2><p>Tell us your dream. We’ll take care of the journey.</p></div><Button asChild variant="hero" size="lg"><Link to="/contact">Let’s plan your holiday <ArrowRight /></Link></Button></div></section>
  </>;
}
