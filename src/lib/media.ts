// All site images and videos are served from /public/media so the site works
// on any host (local dev, Vercel, Netlify, Hostinger…) — not only on Lovable.
// Run `bash scripts/download-media.sh` once to fill public/media.
const m = (file: string) => `/media/${file}`;
export const media = {
  logo: m('as-holidays-logo.jpg'),
  bali: m('bali.jpg'),
  maldives: m('maldives.jpg'),
  dubai: m('dubai.jpg'),
  kashmir: m('kashmir.jpg'),
  kerala: m('kerala.jpg'),
  switzerland: m('switzerland.jpg'),
  goa: m('goa.jpg'),
  rajasthan: m('rajasthan.jpg'),
  thailand: m('thailand.jpg'),
  singapore: m('singapore.jpg'),
  manali: m('manali.jpg'),
  vietnam: m('vietnam.jpg'),
  baliBannerWebm: m('bali-banner.webm'),
  baliBannerMp4: m('bali-banner.mp4'),
} as const;
