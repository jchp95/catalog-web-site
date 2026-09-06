export type DemoCategory = 'Beauty & grooming' | 'Food & hospitality' | 'Homes & property' | 'Automotive';

export type DemoCard = {
  slug: string;
  name: string;
  industry: string;
  category: DemoCategory;
  pitch: string;
  headline: string;
  action: string;
  proof: string[];
  href: string;
  image: string;
  imageAlt: string;
  status: 'live';
  accent: string;
};

export const demos: DemoCard[] = [
  {
    slug: 'mireya', name: 'MIREYA', industry: 'Beauty salon', category: 'Beauty & grooming',
    pitch: 'A little self-care, beautifully booked. Explore treatments, find your stylist and make time for yourself.',
    headline: 'A little more\nyou.', action: 'Try the booking',
    proof: ['Service selection', 'Stylist & date', 'Appointment preview'],
    href: '/demos/mireya', image: '/images/mireya.webp', imageAlt: 'Editorial portrait with soft, flowing blonde hair', status: 'live', accent: '#a18bc9',
  },
  {
    slug: 'blackline', name: 'BLACKLINE', industry: 'Barbershop', category: 'Beauty & grooming',
    pitch: 'Character in every cut. Meet the barbers, choose your service and find your next chair.',
    headline: 'Good hair.\nNo guesswork.', action: 'Find your chair',
    proof: ['Barber selection', 'Service pricing', 'Appointment preview'],
    href: '/demos/blackline', image: '/images/blackline.webp', imageAlt: 'Barber carefully trimming a client’s beard', status: 'live', accent: '#e85d34',
  },
  {
    slug: 'casa-fuego', name: 'CASA FUEGO', industry: 'Restaurant', category: 'Food & hospitality',
    pitch: 'An invitation to stay a little longer. Discover the menu and plan your evening around the table.',
    headline: 'Come hungry.\nStay awhile.', action: 'Explore the menu',
    proof: ['Interactive menu', 'Party & date', 'Table reservation'],
    href: '/demos/casa-fuego', image: '/images/casa-fuego.webp', imageAlt: 'Warm restaurant interior with timber tables and intimate lighting', status: 'live', accent: '#e97748',
  },
  {
    slug: 'harbor', name: 'HARBOR', industry: 'Real estate', category: 'Homes & property',
    pitch: 'More than a place to live. Explore the collection, save your favorites and plan a private tour.',
    headline: 'Find your\nsomewhere.', action: 'Explore the homes',
    proof: ['Property filters', 'Saved homes', 'Private tour request'],
    href: '/demos/harbor', image: '/images/harbor.webp', imageAlt: 'Contemporary coastal home overlooking a swimming pool', status: 'live', accent: '#739b93',
  },
  {
    slug: 'apex', name: 'APEX', industry: 'Auto detailing', category: 'Automotive',
    pitch: 'Obsessive about the finish. Configure your vehicle, compare treatments and build a clear estimate.',
    headline: 'Every detail.\nDialed in.', action: 'Build an estimate',
    proof: ['Vehicle configurator', 'Package & add-ons', 'Instant estimate'],
    href: '/demos/apex', image: '/images/apex.webp', imageAlt: 'Dark performance car photographed on a mountain road', status: 'live', accent: '#73d9ff',
  },
  {
    slug: 'brightline', name: 'BRIGHTLINE', industry: 'Home services', category: 'Homes & property',
    pitch: 'A home that works as it should. Choose the issue, tell us what you need and plan a service visit.',
    headline: 'Life happens.\nWe fix it.', action: 'Plan a service visit',
    proof: ['Guided service request', 'ZIP validation', 'Visit preferences'],
    href: '/demos/brightline', image: '/images/brightline.webp', imageAlt: 'Welcoming modern family home illuminated at dusk', status: 'live', accent: '#3265d5',
  },
];
