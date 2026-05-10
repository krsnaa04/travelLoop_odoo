export type TravelStop = {
  id: string;
  number: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
  summary: string;
  thumbnailLabel: string;
  accent: string;
};

export const travelStops: TravelStop[] = [
  {
    id: 'san-francisco',
    number: 1,
    name: 'San Francisco',
    country: 'USA',
    lat: 37.7749,
    lon: -122.4194,
    summary: 'Pacific launch point with cinematic coastal energy.',
    thumbnailLabel: 'SF',
    accent: 'from-cyan-400 via-teal-400 to-emerald-300',
  },
  {
    id: 'reykjavik',
    number: 2,
    name: 'Reykjavik',
    country: 'Iceland',
    lat: 64.1466,
    lon: -21.9426,
    summary: 'Northern glow, clean architecture, and aurora-night calm.',
    thumbnailLabel: 'RV',
    accent: 'from-sky-400 via-cyan-400 to-teal-300',
  },
  {
    id: 'paris',
    number: 3,
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lon: 2.3522,
    summary: 'Museum mornings, golden-hour boulevards, and late dinners.',
    thumbnailLabel: 'PA',
    accent: 'from-amber-300 via-yellow-300 to-orange-300',
  },
  {
    id: 'dubai',
    number: 4,
    name: 'Dubai',
    country: 'UAE',
    lat: 25.2048,
    lon: 55.2708,
    summary: 'Luxury transit node with skyline views and warm desert nights.',
    thumbnailLabel: 'DU',
    accent: 'from-cyan-300 via-sky-400 to-indigo-300',
  },
  {
    id: 'tokyo',
    number: 5,
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    summary: 'High-energy finale with neon rail loops and city light layers.',
    thumbnailLabel: 'TY',
    accent: 'from-emerald-300 via-cyan-300 to-teal-200',
  },
];

export const travelRoutes = travelStops.slice(0, -1).map((start, index) => ({
  id: `${start.id}-${travelStops[index + 1].id}`,
  startId: start.id,
  endId: travelStops[index + 1].id,
  start,
  end: travelStops[index + 1],
  gradient: index === 0 ? ['#67e8f9', '#34d399', '#facc15'] : ['#22d3ee', '#6ee7b7', '#fb923c'],
}));
