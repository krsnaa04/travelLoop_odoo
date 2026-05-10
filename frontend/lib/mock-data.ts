/**
 * Traveloop Premium Mock Data
 * Realistic, cinematic travel content for dashboard, community, and analytics
 */

export interface PlannedTrip {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: string;
  budget: number;
  currency: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: 'planning' | 'upcoming' | 'active' | 'completed';
  tags: string[];
  coverImage: string;
  shortDescription: string;
  progressPercentage: number;
  favoriteCount: number;
  itineraryHighlights: string[];
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  destination: string;
  country: string;
  caption: string;
  imageUrl: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  hashtags: string[];
  userBadge?: string;
}

export interface TravelActivity {
  id: string;
  title: string;
  destination: string;
  category: string;
  description: string;
  estimatedCost: number;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestTime: string;
  rating: number;
  reviewCount: number;
  hashtags: string[];
}

export interface BudgetBreakdown {
  tripId: string;
  tripTitle: string;
  totalBudget: number;
  currency: string;
  breakdown: {
    transport: number;
    accommodation: number;
    activities: number;
    food: number;
    miscellaneous: number;
  };
  averageDailySpend: number;
  daysPlanned: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  tripsCompleted: number;
  countriesVisited: number;
  followers: number;
  followedBy: number;
  totalDistance: number;
  joinedDate: string;
  badge: string;
  favoriteDestinationType: string;
}

export interface PackingList {
  id: string;
  tripId: string;
  tripTitle: string;
  tripDuration: string;
  climate: string;
  items: {
    category: string;
    items: string[];
    packed: number;
    total: number;
  }[];
  lastUpdated: string;
}

export interface TripJournalEntry {
  id: string;
  tripId: string;
  tripTitle: string;
  destination: string;
  date: string;
  dayNumber: number;
  title: string;
  entry: string;
  mood: string;
  imageUrl?: string;
  location?: string;
}

// ============================================================================
// PLANNED TRIPS (15-20 realistic trips)
// ============================================================================

export const plannedTrips: PlannedTrip[] = [
  {
    id: 'trip-001',
    title: 'Nordic Aurora Expedition',
    destination: 'Reykjavik',
    country: 'Iceland',
    duration: '12 Days',
    budget: 4200,
    currency: 'USD',
    startDate: '2026-12-15',
    endDate: '2026-12-27',
    travelers: 2,
    status: 'upcoming',
    tags: ['Aurora', 'Winter', 'Luxury', 'Photography'],
    coverImage: 'https://images.unsplash.com/photo-1504681869696-d977e9d34ac4?w=800',
    shortDescription:
      'Chasing northern lights through cinematic frozen landscapes, ice caves, and geothermal hot springs.',
    progressPercentage: 75,
    favoriteCount: 342,
    itineraryHighlights: [
      'Golden Circle tour with local guide',
      'Ice cave exploration in Vatnajökull',
      'Blue Lagoon luxury thermal bath',
      'Northern lights hunting at dark sky site',
    ],
  },
  {
    id: 'trip-002',
    title: 'Tokyo Neon Dreams',
    destination: 'Tokyo',
    country: 'Japan',
    duration: '14 Days',
    budget: 3850,
    currency: 'USD',
    startDate: '2026-11-01',
    endDate: '2026-11-14',
    travelers: 1,
    status: 'planning',
    tags: ['Solo', 'Urban', 'Food', 'Culture'],
    coverImage: 'https://images.unsplash.com/photo-1540959375944-7049f642e9d1?w=800',
    shortDescription:
      'Immersive solo journey through Tokyo streets, from Shibuya chaos to Kyoto temples and Michelin-starred ramen shops.',
    progressPercentage: 45,
    favoriteCount: 528,
    itineraryHighlights: [
      'Shibuya Crossing at night',
      'Tsukiji outer market food tour',
      'Robot restaurant experience',
      'Ryoan-ji temple meditation',
      'Karaoke in Shinjuku',
    ],
  },
  {
    id: 'trip-003',
    title: 'Santorini Romance',
    destination: 'Santorini',
    country: 'Greece',
    duration: '8 Days',
    budget: 2950,
    currency: 'USD',
    startDate: '2026-06-10',
    endDate: '2026-06-17',
    travelers: 2,
    status: 'upcoming',
    tags: ['Romance', 'Beach', 'Luxury', 'Sunset'],
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    shortDescription:
      'Sunset dinners on caldera cliffs, private pool villas, and whitewashed village exploration in the Aegean.',
    progressPercentage: 60,
    favoriteCount: 891,
    itineraryHighlights: [
      'Oia sunset experience',
      'Private villa with caldera view',
      'Boat tour to volcanic islands',
      'Wine tasting at local vineyard',
      'Perissa black sand beach',
    ],
  },
  {
    id: 'trip-004',
    title: 'Swiss Alps Alpine Retreat',
    destination: 'Zermatt',
    country: 'Switzerland',
    duration: '10 Days',
    budget: 5600,
    currency: 'USD',
    startDate: '2026-07-15',
    endDate: '2026-07-24',
    travelers: 2,
    status: 'planning',
    tags: ['Mountain', 'Hiking', 'Luxury', 'Adventure'],
    coverImage: 'https://images.unsplash.com/photo-1531366936337-7793b6591205?w=800',
    shortDescription:
      'Premium mountain lodge stays with Matterhorn views, alpine hiking, and Michelin-starred dining.',
    progressPercentage: 30,
    favoriteCount: 412,
    itineraryHighlights: [
      'Matterhorn Ridge Trail hike',
      'Gornergrat Railway journey',
      'Mountain peak yoga retreat',
      'Local cheese and wine tasting',
      'Spa day at luxury resort',
    ],
  },
  {
    id: 'trip-005',
    title: 'Bali Digital Nomad Haven',
    destination: 'Ubud',
    country: 'Indonesia',
    duration: '28 Days',
    budget: 1800,
    currency: 'USD',
    startDate: '2026-09-01',
    endDate: '2026-09-28',
    travelers: 3,
    status: 'planning',
    tags: ['Remote Work', 'Budget', 'Adventure', 'Wellness'],
    coverImage: 'https://images.unsplash.com/photo-1537225228614-b6f3424ca6a2?w=800',
    shortDescription:
      'Month-long coliving experience with yoga, co-working, rice terrace exploration, and temple ceremonies.',
    progressPercentage: 55,
    favoriteCount: 634,
    itineraryHighlights: [
      'Tegallalang Rice Terraces trek',
      'Daily yoga and meditation',
      'Ubud night market exploration',
      'Temple blessing ceremonies',
      'Motorbike island tour',
    ],
  },
  {
    id: 'trip-006',
    title: 'Dubai Luxury Escape',
    destination: 'Dubai',
    country: 'UAE',
    duration: '6 Days',
    budget: 4800,
    currency: 'USD',
    startDate: '2026-03-20',
    endDate: '2026-03-25',
    travelers: 2,
    status: 'upcoming',
    tags: ['Luxury', 'Beach', 'Shopping', 'Urban'],
    coverImage: 'https://images.unsplash.com/photo-1512453475868-9dcd1b7660d3?w=800',
    shortDescription:
      'Ultra-luxury shopping, Burj Khalifa dining, desert safaris, and exclusive beach club access.',
    progressPercentage: 80,
    favoriteCount: 756,
    itineraryHighlights: [
      'Burj Khalifa 148th floor dinner',
      'Desert dune bashing',
      'Yacht sunset cruise',
      'Gold Souk shopping tour',
      'Michelin-star fine dining',
    ],
  },
  {
    id: 'trip-007',
    title: 'Patagonia Adventure Quest',
    destination: 'El Chaltén',
    country: 'Argentina',
    duration: '15 Days',
    budget: 2400,
    currency: 'USD',
    startDate: '2026-02-01',
    endDate: '2026-02-15',
    travelers: 4,
    status: 'planning',
    tags: ['Adventure', 'Hiking', 'Budget', 'Nature'],
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    shortDescription:
      'Epic Patagonian hiking, glacier trekking, mountain lodge stays, and wildly dramatic landscapes.',
    progressPercentage: 40,
    favoriteCount: 523,
    itineraryHighlights: [
      'Laguna de los Tres Picos trek',
      'Perito Moreno Glacier hike',
      'Mountain lodge experiences',
      'Horseback riding through valleys',
      'Sunrise at Fitz Roy viewpoint',
    ],
  },
  {
    id: 'trip-008',
    title: 'Paris Art & Culture Week',
    destination: 'Paris',
    country: 'France',
    duration: '9 Days',
    budget: 3200,
    currency: 'USD',
    startDate: '2026-10-08',
    endDate: '2026-10-16',
    travelers: 2,
    status: 'planning',
    tags: ['Art', 'Culture', 'Romance', 'Food'],
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760566f3?w=800',
    shortDescription:
      'Golden hour along the Seine, Louvre after-hours tour, hidden café culture, and Michelin dining.',
    progressPercentage: 50,
    favoriteCount: 802,
    itineraryHighlights: [
      'Louvre private after-hours tour',
      'Versailles palace exploration',
      'Left Bank café hopping',
      'French cooking class',
      'Montmartre artist exploration',
    ],
  },
  {
    id: 'trip-009',
    title: 'Maldives Overwater Luxury',
    destination: 'Male',
    country: 'Maldives',
    duration: '7 Days',
    budget: 6200,
    currency: 'USD',
    startDate: '2026-05-15',
    endDate: '2026-05-21',
    travelers: 2,
    status: 'planning',
    tags: ['Luxury', 'Beach', 'Honeymoon', 'Diving'],
    coverImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
    shortDescription:
      'Overwater villa stays, pristine diving, infinity pool breakfasts, and turquoise lagoon exploration.',
    progressPercentage: 35,
    favoriteCount: 945,
    itineraryHighlights: [
      'Overwater bungalow stay',
      'House reef snorkeling',
      'Sunset dolphin cruise',
      'Spa treatment in ocean pavilion',
      'Gourmet underwater dining',
    ],
  },
  {
    id: 'trip-010',
    title: 'New York City Marathon',
    destination: 'New York',
    country: 'USA',
    duration: '10 Days',
    budget: 2800,
    currency: 'USD',
    startDate: '2026-11-01',
    endDate: '2026-11-10',
    travelers: 1,
    status: 'upcoming',
    tags: ['Running', 'Urban', 'Solo', 'Event'],
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    shortDescription:
      'Marathon race experience combined with Broadway shows, rooftop dinners, and iconic NYC landmarks.',
    progressPercentage: 70,
    favoriteCount: 467,
    itineraryHighlights: [
      'NYC Marathon race day',
      'Broadway musical evening',
      'Central Park running tour',
      'Rooftop bar experiences',
      'Museum of Modern Art tour',
    ],
  },
  {
    id: 'trip-011',
    title: 'Thailand Island Hopping',
    destination: 'Phuket',
    country: 'Thailand',
    duration: '12 Days',
    budget: 1650,
    currency: 'USD',
    startDate: '2026-04-10',
    endDate: '2026-04-21',
    travelers: 3,
    status: 'planning',
    tags: ['Budget', 'Beach', 'Adventure', 'Food'],
    coverImage: 'https://images.unsplash.com/photo-1552394323-b41265914636?w=800',
    shortDescription:
      'Island hopping through Phi Phi, Krabi, James Bond rock formations, and night market food tours.',
    progressPercentage: 25,
    favoriteCount: 678,
    itineraryHighlights: [
      'Phang Nga Bay kayaking',
      'Phi Phi island exploration',
      'Limestone cliff climbing',
      'Night market street food',
      'Traditional Thai cooking class',
    ],
  },
  {
    id: 'trip-012',
    title: 'Canadian Banff National Park',
    destination: 'Banff',
    country: 'Canada',
    duration: '11 Days',
    budget: 3100,
    currency: 'USD',
    startDate: '2026-08-01',
    endDate: '2026-08-11',
    travelers: 2,
    status: 'planning',
    tags: ['Nature', 'Hiking', 'Adventure', 'Photography'],
    coverImage: 'https://images.unsplash.com/photo-1511576661531-b34c7cb5f4a9?w=800',
    shortDescription:
      'Turquoise lake exploration, mountain lodge stays, scenic Icefields Parkway, and grizzly bear spotting.',
    progressPercentage: 45,
    favoriteCount: 589,
    itineraryHighlights: [
      'Lake Louise paddle',
      'Plain of Six Glaciers hike',
      'Icefields Parkway drive',
      'Moraine Lake at sunrise',
      'Luxury mountain lodge stay',
    ],
  },
  {
    id: 'trip-013',
    title: 'Singapore Modern Metropolis',
    destination: 'Singapore',
    country: 'Singapore',
    duration: '5 Days',
    budget: 1900,
    currency: 'USD',
    startDate: '2026-05-10',
    endDate: '2026-05-14',
    travelers: 1,
    status: 'planning',
    tags: ['Urban', 'Food', 'Shopping', 'Modern'],
    coverImage: 'https://images.unsplash.com/photo-1516885657613-9f3515b0c78f?w=800',
    shortDescription:
      'Urban food paradise with Michelin street food, Marina Bay Sands dining, gardens, and colonial architecture.',
    progressPercentage: 55,
    favoriteCount: 512,
    itineraryHighlights: [
      'Hawker food court tours',
      'Gardens by the Bay night lights',
      'Marina Bay Sands rooftop bar',
      'Sentosa island exploration',
      'Colonial district walking tour',
    ],
  },
  {
    id: 'trip-014',
    title: 'Cappadocia Hot Air Balloon Dawn',
    destination: 'Cappadocia',
    country: 'Turkey',
    duration: '8 Days',
    budget: 1750,
    currency: 'USD',
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    travelers: 2,
    status: 'planning',
    tags: ['Adventure', 'Photography', 'Budget', 'Romance'],
    coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    shortDescription:
      'Sunrise hot air balloon over fairy chimney landscapes, cave hotel stays, and underground city exploration.',
    progressPercentage: 30,
    favoriteCount: 823,
    itineraryHighlights: [
      'Hot air balloon sunrise flight',
      'Cave hotel underground stay',
      'Derinkuyu underground city tour',
      'Turkish pottery workshop',
      'Sunset at Uchisar castle',
    ],
  },
  {
    id: 'trip-015',
    title: 'Rome Historical Deep Dive',
    destination: 'Rome',
    country: 'Italy',
    duration: '10 Days',
    budget: 2650,
    currency: 'USD',
    startDate: '2026-09-12',
    endDate: '2026-09-21',
    travelers: 2,
    status: 'planning',
    tags: ['History', 'Culture', 'Food', 'Romance'],
    coverImage: 'https://images.unsplash.com/photo-1552832860-cfaf67ef42f9?w=800',
    shortDescription:
      'Ancient Rome exploration with Colosseum tours, Vatican museums, gelato in Trastevere, and wine tasting.',
    progressPercentage: 40,
    favoriteCount: 756,
    itineraryHighlights: [
      'Vatican Museums private tour',
      'Colosseum underground access',
      'Trastevere neighborhood evening',
      'Italian cooking class',
      'Wine pairing dinner',
    ],
  },
  {
    id: 'trip-016',
    title: 'Kyoto Traditional Japan',
    destination: 'Kyoto',
    country: 'Japan',
    duration: '7 Days',
    budget: 1850,
    currency: 'USD',
    startDate: '2026-04-01',
    endDate: '2026-04-07',
    travelers: 2,
    status: 'planning',
    tags: ['Culture', 'History', 'Zen', 'Photography'],
    coverImage: 'https://images.unsplash.com/photo-1528164344705-47542687f6f9?w=800',
    shortDescription:
      'Sacred temples, bamboo forests, geisha district exploration, and traditional kaiseki multi-course dining.',
    progressPercentage: 35,
    favoriteCount: 687,
    itineraryHighlights: [
      'Fushimi Inari thousands of gates',
      'Arashiyama bamboo grove walk',
      'Geisha performance evening',
      'Kaiseki dinner experience',
      'Tea ceremony at temple',
    ],
  },
  {
    id: 'trip-017',
    title: 'Norway Fjord Sailing',
    destination: 'Geirangerfjord',
    country: 'Norway',
    duration: '10 Days',
    budget: 4100,
    currency: 'USD',
    startDate: '2026-07-05',
    endDate: '2026-07-14',
    travelers: 4,
    status: 'planning',
    tags: ['Adventure', 'Sailing', 'Nature', 'Luxury'],
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    shortDescription:
      'Fjord sailing adventure with waterfall kayaking, luxury lodge stays, hiking, and midnight sun experiences.',
    progressPercentage: 50,
    favoriteCount: 612,
    itineraryHighlights: [
      'Geirangerfjord sailing tour',
      'Waterfall kayaking expedition',
      'Mountain lodge luxury stay',
      'Flåm railway scenic journey',
      'Viking history museum visit',
    ],
  },
  {
    id: 'trip-018',
    title: 'Morocco Sahara Desert Quest',
    destination: 'Marrakech',
    country: 'Morocco',
    duration: '12 Days',
    budget: 2200,
    currency: 'USD',
    startDate: '2026-10-15',
    endDate: '2026-10-26',
    travelers: 3,
    status: 'planning',
    tags: ['Adventure', 'Culture', 'Desert', 'Budget'],
    coverImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=800',
    shortDescription:
      'Medina bazaars, Sahara camel trekking, Berber village stays, and Atlas Mountains exploration.',
    progressPercentage: 45,
    favoriteCount: 534,
    itineraryHighlights: [
      'Jemaa el-Fnaa square evening',
      'Sahara desert camel trek',
      'Berber village overnight stay',
      'Atlas Mountains hiking',
      'Argan oil cooperative visit',
    ],
  },
  {
    id: 'trip-019',
    title: 'Colombia Coffee & Culture',
    destination: 'Bogotá',
    country: 'Colombia',
    duration: '14 Days',
    budget: 1600,
    currency: 'USD',
    startDate: '2026-03-10',
    endDate: '2026-03-23',
    travelers: 2,
    status: 'planning',
    tags: ['Culture', 'Food', 'Budget', 'Adventure'],
    coverImage: 'https://images.unsplash.com/photo-1548588528-c3a877cf84c1?w=800',
    shortDescription:
      'Coffee farm tours, colonial cities, Lost City trek, street art exploration, and Pacific coast adventure.',
    progressPercentage: 20,
    favoriteCount: 445,
    itineraryHighlights: [
      'Coffee plantation tour',
      'Ciudad Perdida trek',
      'Tayrona National Park',
      'Cartagena colonial charm',
      'Street art graffiti tour',
    ],
  },
  {
    id: 'trip-020',
    title: 'Iceland Midnight Sun Summer',
    destination: 'Reykjavik',
    country: 'Iceland',
    duration: '11 Days',
    budget: 3800,
    currency: 'USD',
    startDate: '2026-06-20',
    endDate: '2026-07-01',
    travelers: 2,
    status: 'planning',
    tags: ['Nature', 'Photography', 'Adventure', 'Summer'],
    coverImage: 'https://images.unsplash.com/photo-1500595046891-e21786df267c?w=800',
    shortDescription:
      'Summer midnight sun, epic waterfall hikes, glacier exploration, and luxury hot spring experiences.',
    progressPercentage: 60,
    favoriteCount: 723,
    itineraryHighlights: [
      'Golden Circle complete route',
      'Seljalandsfoss waterfall hike',
      'Vatnajökull glacier trek',
      'Secret Lagoon thermal bath',
      'Hiking midnight sun experience',
    ],
  },
];

// ============================================================================
// COMMUNITY FEED (Social posts)
// ============================================================================

export const communityFeed: CommunityPost[] = [
  {
    id: 'post-001',
    userId: 'user-101',
    username: 'sophiawanders',
    avatar: 'https://i.pravatar.cc/150?img=1',
    destination: 'Santorini',
    country: 'Greece',
    caption:
      'Found this hidden café tucked into the Oia cliffs. Golden hour + espresso = pure magic. The locals told me tourists never find this spot because it\'s "too far" up the stairs. Worth every step.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    timestamp: '2 hours ago',
    likes: 3420,
    comments: 287,
    shares: 456,
    hashtags: ['#Santorini', '#HiddenGems', '#GoldenHour', '#CaféLife'],
    userBadge: 'Premium Traveler',
  },
  {
    id: 'post-002',
    userId: 'user-102',
    username: 'tokyodrops',
    avatar: 'https://i.pravatar.cc/150?img=2',
    destination: 'Tokyo',
    country: 'Japan',
    caption:
      'Stumbled into this 40-year-old ramen shop in a Shibuya basement. The chef remembered me from yesterday. That\'s not a coincidence in Tokyo—it\'s culture. 🍜',
    imageUrl: 'https://images.unsplash.com/photo-1545619581-a3ce100b3d21?w=800',
    timestamp: '4 hours ago',
    likes: 5621,
    comments: 512,
    shares: 823,
    hashtags: ['#Tokyo', '#RamenAddict', '#LocalFood', '#Japan'],
    userBadge: 'Explorer Elite',
  },
  {
    id: 'post-003',
    userId: 'user-103',
    username: 'mountainmike',
    avatar: 'https://i.pravatar.cc/150?img=3',
    destination: 'Banff',
    country: 'Canada',
    caption:
      'Woke up at 4AM for this sunrise. Lake Louise was completely frozen over. Paddled across 2km of fresh ice while the sky turned pink. First person to do this this year. Incredible.',
    imageUrl: 'https://images.unsplash.com/photo-1511576661531-b34c7cb5f4a9?w=800',
    timestamp: '1 day ago',
    likes: 7234,
    comments: 623,
    shares: 1205,
    hashtags: ['#Banff', '#NationalPark', '#Adventure', '#Canada'],
    userBadge: 'Adventure Legend',
  },
  {
    id: 'post-004',
    userId: 'user-104',
    username: 'chefwanders',
    avatar: 'https://i.pravatar.cc/150?img=4',
    destination: 'Paris',
    country: 'France',
    caption:
      'This Michelin chef literally taught me to make crème brûlée in a 2-hour class in her Marais kitchen. She cracked the sugar with such precision. Art, honestly.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=800',
    timestamp: '1 day ago',
    likes: 4156,
    comments: 389,
    shares: 612,
    hashtags: ['#Paris', '#FrenchCooking', '#Michelin', '#CookingClass'],
  },
  {
    id: 'post-005',
    userId: 'user-105',
    username: 'divedeep',
    avatar: 'https://i.pravatar.cc/150?img=5',
    destination: 'Maldives',
    country: 'Maldives',
    caption:
      'Swimming with manta rays at sunset is an experience that rewires your brain. These creatures are pure grace. Moment of silence for how many we\'ve lost. 💙',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
    timestamp: '2 days ago',
    likes: 8901,
    comments: 734,
    shares: 1823,
    hashtags: ['#Maldives', '#OceanLife', '#MantaRays', '#SnorkelingLife'],
    userBadge: 'Ocean Protector',
  },
  {
    id: 'post-006',
    userId: 'user-106',
    username: 'designerjess',
    avatar: 'https://i.pravatar.cc/150?img=6',
    destination: 'Dubai',
    country: 'UAE',
    caption:
      'Booked a sunset at Burj Khalifa Level 148. The city literally glows gold when the sun hits right. This is what "peak luxury" looks like when your budget aligns with experience.',
    imageUrl: 'https://images.unsplash.com/photo-1512453475868-9dcd1b7660d3?w=800',
    timestamp: '3 days ago',
    likes: 6234,
    comments: 445,
    shares: 789,
    hashtags: ['#Dubai', '#BurjKhalifa', '#LuxuryTravel', '#UAE'],
    userBadge: 'Luxury Curator',
  },
  {
    id: 'post-007',
    userId: 'user-107',
    username: 'balifocus',
    avatar: 'https://i.pravatar.cc/150?img=7',
    destination: 'Ubud',
    country: 'Indonesia',
    caption:
      'This is day 18 of my 28-day Bali immersion. Co-working by morning. Rice terraces by afternoon. Evening yoga. Monthly rent is $400. This is why digital nomads love this island.',
    imageUrl: 'https://images.unsplash.com/photo-1537225228614-b6f3424ca6a2?w=800',
    timestamp: '3 days ago',
    likes: 5678,
    comments: 512,
    shares: 823,
    hashtags: ['#Bali', '#DigitalNomad', '#Ubud', '#RemoteWork'],
    userBadge: 'Nomad Master',
  },
  {
    id: 'post-008',
    userId: 'user-108',
    username: 'architecturelover',
    avatar: 'https://i.pravatar.cc/150?img=8',
    destination: 'Singapore',
    country: 'Singapore',
    caption:
      'Singapore at night is a lesson in urban planning mastery. Every building has a story. Every corner is designed. This is what happens when a city is built intentionally.',
    imageUrl: 'https://images.unsplash.com/photo-1516885657613-9f3515b0c78f?w=800',
    timestamp: '4 days ago',
    likes: 4523,
    comments: 378,
    shares: 612,
    hashtags: ['#Singapore', '#UrbanPlanning', '#Architecture', '#AsianCities'],
  },
  {
    id: 'post-009',
    userId: 'user-109',
    username: 'nightmarketaddict',
    avatar: 'https://i.pravatar.cc/150?img=9',
    destination: 'Bangkok',
    country: 'Thailand',
    caption:
      'Thai street food budget hack: skip the tourist areas. Go where locals eat. This entire meal was $2.50 and it changed my life. Best money spent on this trip.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900052-b8b4e94b16a9?w=800',
    timestamp: '5 days ago',
    likes: 7821,
    comments: 623,
    shares: 1245,
    hashtags: ['#Thailand', '#StreetFood', '#BudgetTravel', '#BangkokFood'],
    userBadge: 'Food Scout',
  },
  {
    id: 'post-010',
    userId: 'user-110',
    username: 'cappadociamagic',
    avatar: 'https://i.pravatar.cc/150?img=10',
    destination: 'Cappadocia',
    country: 'Turkey',
    caption:
      'Hot air balloon at sunrise over fairy chimneys = transcendent. Also turns out I\'m afraid of heights more than I thought. Worth the terror though. 🎈',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    timestamp: '5 days ago',
    likes: 9234,
    comments: 834,
    shares: 1623,
    hashtags: ['#Cappadocia', '#HotAirBalloon', '#Turkey', '#Adventure'],
    userBadge: 'Adventure Seeker',
  },
];

// ============================================================================
// TRAVEL ACTIVITIES
// ============================================================================

export const travelActivities: TravelActivity[] = [
  {
    id: 'activity-001',
    title: 'Tsukiji Outer Market Food Tour',
    destination: 'Tokyo',
    category: 'Food Tour',
    description:
      'Guided tour through one of Japan\'s most famous food markets with a local expert. Sample fresh sushi, oysters, and wagyu while learning about Tokyo\'s food culture.',
    estimatedCost: 95,
    duration: '3 hours',
    difficulty: 'easy',
    bestTime: 'Early morning (6-9 AM)',
    rating: 4.8,
    reviewCount: 2340,
    hashtags: ['#FoodTour', '#Tokyo', '#Sushi', '#LocalFood'],
  },
  {
    id: 'activity-002',
    title: 'Laguna de los Tres Picos Trek',
    destination: 'El Chaltén',
    category: 'Hiking',
    description:
      'Full-day hiking adventure to three glacial lakes with stunning views of Mount Fitz Roy. Considered one of the most scenic hikes in Patagonia.',
    estimatedCost: 0,
    duration: '10-11 hours',
    difficulty: 'challenging',
    bestTime: 'November-April',
    rating: 4.9,
    reviewCount: 1567,
    hashtags: ['#Hiking', '#Patagonia', '#Argentina', '#MountainLife'],
  },
  {
    id: 'activity-003',
    title: 'Vatican Museums Private After-Hours Tour',
    destination: 'Rome',
    category: 'Museum Tour',
    description:
      'Exclusive evening access to the Vatican Museums with an art historian guide. See the Sistine Chapel and ancient galleries without the crowds.',
    estimatedCost: 350,
    duration: '3.5 hours',
    difficulty: 'easy',
    bestTime: 'Tuesday-Thursday evenings',
    rating: 4.9,
    reviewCount: 3120,
    hashtags: ['#Vatican', '#Art', '#Rome', '#CultureTrip'],
  },
  {
    id: 'activity-004',
    title: 'Hot Air Balloon Sunrise Flight',
    destination: 'Cappadocia',
    category: 'Adventure',
    description:
      'Float above fairy chimneys at sunrise in a private hot air balloon. Includes pre-flight breakfast and champagne celebration.',
    estimatedCost: 180,
    duration: '4 hours',
    difficulty: 'easy',
    bestTime: 'April-November',
    rating: 4.8,
    reviewCount: 4567,
    hashtags: ['#HotAirBalloon', '#Cappadocia', '#Sunrise', '#Adventure'],
  },
  {
    id: 'activity-005',
    title: 'Geirangerfjord Luxury Sailing',
    destination: 'Geirangerfjord',
    category: 'Sailing',
    description:
      'Multi-day sailing expedition through one of Norway\'s most stunning fjords. Sleep on luxury sailboat with gourmet meals and natural hot spring access.',
    estimatedCost: 2400,
    duration: '3-7 days',
    difficulty: 'moderate',
    bestTime: 'June-August',
    rating: 4.9,
    reviewCount: 892,
    hashtags: ['#Sailing', '#Norway', '#Fjords', '#LuxuryTravel'],
  },
  {
    id: 'activity-006',
    title: 'Snorkeling with Manta Rays',
    destination: 'Maldives',
    category: 'Diving',
    description:
      'Guided snorkeling experience to encounter gentle manta rays in their natural habitat. Seasonal but incredibly rewarding when conditions align.',
    estimatedCost: 120,
    duration: '3-4 hours',
    difficulty: 'easy',
    bestTime: 'March-May, September-November',
    rating: 4.7,
    reviewCount: 2156,
    hashtags: ['#Snorkeling', '#Maldives', '#MantaRays', '#OceanLife'],
  },
  {
    id: 'activity-007',
    title: 'Arashiyama Bamboo Forest Sunrise Walk',
    destination: 'Kyoto',
    category: 'Nature Walk',
    description:
      'Serene early morning walk through 700+ acres of towering bamboo forests. Arrive before crowds for the most magical experience.',
    estimatedCost: 0,
    duration: '1.5 hours',
    difficulty: 'easy',
    bestTime: 'Any season, best before 7 AM',
    rating: 4.8,
    reviewCount: 5234,
    hashtags: ['#Kyoto', '#BambooForest', '#Nature', '#Japan'],
  },
  {
    id: 'activity-008',
    title: 'Sahara Camel Trek & Berber Overnight',
    destination: 'Marrakech',
    category: 'Cultural Adventure',
    description:
      'Multi-day camel trek through the Sahara Desert with overnight stay in a traditional Berber village. Includes meals and authentic cultural immersion.',
    estimatedCost: 240,
    duration: '2-3 days',
    difficulty: 'moderate',
    bestTime: 'October-May',
    rating: 4.7,
    reviewCount: 1834,
    hashtags: ['#Sahara', '#Morocco', '#CulturalTravel', '#BerberCulture'],
  },
  {
    id: 'activity-009',
    title: 'Michelin Restaurant Dinner Experience',
    destination: 'Paris',
    category: 'Fine Dining',
    description:
      'Multi-course tasting menu at a Michelin-starred restaurant with wine pairings selected by sommeliers. Reservations 2+ months in advance recommended.',
    estimatedCost: 280,
    duration: '3-4 hours',
    difficulty: 'easy',
    bestTime: 'Year-round, dinner service',
    rating: 4.9,
    reviewCount: 3621,
    hashtags: ['#Paris', '#MichelinStar', '#FineDining', '#FrenchCuisine'],
  },
  {
    id: 'activity-010',
    title: 'Lost City Trek (Ciudad Perdida)',
    destination: 'Bogotá',
    category: 'Hiking',
    description:
      'Multi-day trek to pre-Columbian ruins nestled in the Colombian jungle. More remote and less touristy than Machu Picchu.',
    estimatedCost: 320,
    duration: '4-5 days',
    difficulty: 'challenging',
    bestTime: 'December-April',
    rating: 4.8,
    reviewCount: 1245,
    hashtags: ['#Colombia', '#Hiking', '#LostCity', '#Adventure'],
  },
  {
    id: 'activity-011',
    title: 'Midnight Sun Hiking',
    destination: 'Reykjavik',
    category: 'Hiking',
    description:
      'Experience Icelandic summer nights with 24-hour daylight. Hike stunning mountain trails when the sun barely dips below the horizon.',
    estimatedCost: 85,
    duration: '4-6 hours',
    difficulty: 'moderate',
    bestTime: 'June-July',
    rating: 4.8,
    reviewCount: 1678,
    hashtags: ['#Iceland', '#MidnightSun', '#NatureHike', '#Summer'],
  },
  {
    id: 'activity-012',
    title: 'Thai Cooking Class',
    destination: 'Bangkok',
    category: 'Cooking Class',
    description:
      'Learn to cook traditional Thai dishes in a local home kitchen. Shop at morning market for ingredients, then prepare and eat 4-5 dishes.',
    estimatedCost: 65,
    duration: '5 hours',
    difficulty: 'easy',
    bestTime: 'Year-round, morning classes',
    rating: 4.8,
    reviewCount: 2890,
    hashtags: ['#Thailand', '#CookingClass', '#LocalFood', '#BangkokFood'],
  },
];

// ============================================================================
// BUDGET ANALYTICS
// ============================================================================

export const budgetBreakdowns: BudgetBreakdown[] = [
  {
    tripId: 'trip-001',
    tripTitle: 'Nordic Aurora Expedition',
    totalBudget: 4200,
    currency: 'USD',
    breakdown: {
      transport: 1200,
      accommodation: 1400,
      activities: 800,
      food: 600,
      miscellaneous: 200,
    },
    averageDailySpend: 350,
    daysPlanned: 12,
  },
  {
    tripId: 'trip-002',
    tripTitle: 'Tokyo Neon Dreams',
    totalBudget: 3850,
    currency: 'USD',
    breakdown: {
      transport: 950,
      accommodation: 1200,
      activities: 800,
      food: 700,
      miscellaneous: 200,
    },
    averageDailySpend: 275,
    daysPlanned: 14,
  },
  {
    tripId: 'trip-003',
    tripTitle: 'Santorini Romance',
    totalBudget: 2950,
    currency: 'USD',
    breakdown: {
      transport: 600,
      accommodation: 1200,
      activities: 450,
      food: 550,
      miscellaneous: 150,
    },
    averageDailySpend: 369,
    daysPlanned: 8,
  },
  {
    tripId: 'trip-005',
    tripTitle: 'Bali Digital Nomad Haven',
    totalBudget: 1800,
    currency: 'USD',
    breakdown: {
      transport: 400,
      accommodation: 560,
      activities: 300,
      food: 420,
      miscellaneous: 120,
    },
    averageDailySpend: 64,
    daysPlanned: 28,
  },
  {
    tripId: 'trip-006',
    tripTitle: 'Dubai Luxury Escape',
    totalBudget: 4800,
    currency: 'USD',
    breakdown: {
      transport: 1100,
      accommodation: 1800,
      activities: 900,
      food: 700,
      miscellaneous: 300,
    },
    averageDailySpend: 800,
    daysPlanned: 6,
  },
];

// ============================================================================
// USER PROFILES
// ============================================================================

export const userProfiles: UserProfile[] = [
  {
    id: 'user-101',
    username: 'sophiawanders',
    email: 'sophia@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Chasing sunsets and hidden gems across 45+ countries. Photographer. Dreamer.',
    location: 'Barcelona, Spain',
    tripsCompleted: 28,
    countriesVisited: 47,
    followers: 12400,
    followedBy: 3200,
    totalDistance: 342000,
    joinedDate: '2022-03-15',
    badge: 'Premium Traveler',
    favoriteDestinationType: 'Beach & Cultural',
  },
  {
    id: 'user-102',
    username: 'tokyodrops',
    email: 'tokyo@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Urban explorer obsessed with food culture and street photography.',
    location: 'Tokyo, Japan',
    tripsCompleted: 34,
    countriesVisited: 31,
    followers: 18200,
    followedBy: 5600,
    totalDistance: 287000,
    joinedDate: '2021-08-22',
    badge: 'Explorer Elite',
    favoriteDestinationType: 'Urban & Food',
  },
  {
    id: 'user-103',
    username: 'mountainmike',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Adventure athlete. Mountains are my happy place. Always chasing the next peak.',
    location: 'Banff, Canada',
    tripsCompleted: 42,
    countriesVisited: 18,
    followers: 15600,
    followedBy: 4200,
    totalDistance: 450000,
    joinedDate: '2020-06-10',
    badge: 'Adventure Legend',
    favoriteDestinationType: 'Mountains & Nature',
  },
  {
    id: 'user-104',
    username: 'chefwanders',
    email: 'chef@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Food writer. Cooking classes enthusiast. Believe travel is about feeding your soul.',
    location: 'Paris, France',
    tripsCompleted: 26,
    countriesVisited: 39,
    followers: 9800,
    followedBy: 2400,
    totalDistance: 298000,
    joinedDate: '2022-01-18',
    badge: 'Culinary Master',
    favoriteDestinationType: 'Food & Culture',
  },
  {
    id: 'user-105',
    username: 'divedeep',
    email: 'dive@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Ocean conservation advocate. Certified diver. Every trip underwater counts.',
    location: 'Maldives',
    tripsCompleted: 19,
    countriesVisited: 24,
    followers: 8900,
    followedBy: 2800,
    totalDistance: 156000,
    joinedDate: '2023-02-14',
    badge: 'Ocean Protector',
    favoriteDestinationType: 'Beach & Diving',
  },
];

// ============================================================================
// PACKING LISTS
// ============================================================================

export const packingLists: PackingList[] = [
  {
    id: 'packing-001',
    tripId: 'trip-001',
    tripTitle: 'Nordic Aurora Expedition',
    tripDuration: '12 Days',
    climate: 'Arctic Winter',
    items: [
      {
        category: 'Clothing',
        items: [
          'Thermal base layers (merino wool)',
          'Insulated jacket',
          'Waterproof outer shell',
          'Thermal pants',
          'Wool sweaters (3)',
          'Insulated winter boots',
          'Wool socks (7 pairs)',
          'Thermal underwear',
          'Warm hat and balaclava',
          'Insulated gloves (2 pairs)',
          'Scarf or neck warmer',
        ],
        packed: 8,
        total: 11,
      },
      {
        category: 'Accessories',
        items: [
          'Camera (for northern lights)',
          'Tripod',
          'Portable hand warmers',
          'Moisturizer (for dry climate)',
          'Lip balm with SPF',
          'Sunglasses (UV protection)',
        ],
        packed: 4,
        total: 6,
      },
      {
        category: 'Documents',
        items: ['Passport', 'Travel insurance', 'Flight tickets', 'Hotel reservations', 'Visa (if needed)'],
        packed: 5,
        total: 5,
      },
    ],
    lastUpdated: '2026-11-20',
  },
  {
    id: 'packing-002',
    tripId: 'trip-003',
    tripTitle: 'Santorini Romance',
    tripDuration: '8 Days',
    climate: 'Mediterranean Summer',
    items: [
      {
        category: 'Clothing',
        items: [
          'Light summer dresses (3)',
          'Shorts (3 pairs)',
          'T-shirts (4)',
          'Lightweight cardigan',
          'Sandals (2 pairs)',
          'Evening outfit for dinner',
          'Swimsuits (2)',
          'Cover-up',
          'Light wrap or scarf',
        ],
        packed: 7,
        total: 9,
      },
      {
        category: 'Beach Essentials',
        items: [
          'Sunscreen (SPF 50+)',
          'After-sun lotion',
          'Sunglasses',
          'Beach bag',
          'Flip flops',
          'Waterproof phone case',
          'Underwater camera',
        ],
        packed: 5,
        total: 7,
      },
      {
        category: 'Beauty & Toiletries',
        items: ['Face moisturizer', 'Lip balm', 'Minimal makeup (waterproof)', 'Deodorant', 'Hair ties'],
        packed: 3,
        total: 5,
      },
    ],
    lastUpdated: '2026-05-10',
  },
];

// ============================================================================
// TRIP JOURNAL ENTRIES
// ============================================================================

export const tripJournalEntries: TripJournalEntry[] = [
  {
    id: 'journal-001',
    tripId: 'trip-001',
    tripTitle: 'Nordic Aurora Expedition',
    destination: 'Reykjavik, Iceland',
    date: '2026-12-16',
    dayNumber: 2,
    title: 'First Aurora Dance',
    entry:
      'Woke up at midnight because the sky turned green. No alarm needed—just pure adrenaline. Watched the northern lights shimmer and dance for hours. They move like living creatures. It\'s impossible to capture with a camera what you feel watching them with your own eyes. The Icelandic guide said this was an "active night." I can\'t imagine a more active one.',
    mood: 'Awestruck',
    imageUrl: 'https://images.unsplash.com/photo-1504681869696-d977e9d34ac4?w=600',
    location: 'Jökulsárlón Glacier Lagoon',
  },
  {
    id: 'journal-002',
    tripId: 'trip-002',
    tripTitle: 'Tokyo Neon Dreams',
    destination: 'Tokyo, Japan',
    date: '2026-11-05',
    dayNumber: 5,
    title: 'Ramen Shop Epiphany',
    entry:
      'Stumbled into a 40-year-old ramen shop at 2 AM in a Shibuya basement. The chef was 74, worked alone, and served the same menu for four decades. When he found out it was my first bowl in Japan, he cooked an extra egg and wouldn\'t let me pay. That moment felt more valuable than any guidebook. This is what solo travel gives you.',
    mood: 'Connected',
    imageUrl: 'https://images.unsplash.com/photo-1545619581-a3ce100b3d21?w=600',
    location: 'Shibuya Underground Ramen Shop',
  },
  {
    id: 'journal-003',
    tripId: 'trip-003',
    tripTitle: 'Santorini Romance',
    destination: 'Santorini, Greece',
    date: '2026-06-14',
    dayNumber: 5,
    title: 'Cliffside Ceremony',
    entry:
      'Watched the sun disappear behind the Santorini cliffs while local bouzouki music echoed through the streets. The sky turned every color of fire. A local couple danced. Wine glasses clinked. For a moment, time stopped. This is why people risk everything for sunsets in Santorini.',
    mood: 'Romantic',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600',
    location: 'Oia Sunset Viewpoint',
  },
  {
    id: 'journal-004',
    tripId: 'trip-005',
    tripTitle: 'Bali Digital Nomad Haven',
    destination: 'Ubud, Bali',
    date: '2026-09-15',
    dayNumber: 15,
    title: 'Monkey Wisdom',
    entry:
      'Hiking through the monkey forest at sunrise. A mother monkey stared at me with such intelligence. Made me realize how small and insignificant my "urgent" emails feel. Decided to go offline for the rest of the month. Some things matter more than notifications.',
    mood: 'Reflective',
    imageUrl: 'https://images.unsplash.com/photo-1537225228614-b6f3424ca6a2?w=600',
    location: 'Sacred Monkey Forest, Ubud',
  },
  {
    id: 'journal-005',
    tripId: 'trip-007',
    tripTitle: 'Patagonia Adventure Quest',
    destination: 'El Chaltén, Argentina',
    date: '2026-02-08',
    dayNumber: 8,
    title: 'Mountain Peak Moment',
    entry:
      'Reached Laguna de los Tres Picos at noon. Three glacier lakes, three different shades of blue. Mount Fitz Roy towered above us like a guardian. We sat in silence for an hour. Our friend started crying (good tears). Mountains have that power—they make you realize what\'s real and what\'s noise. That hike was worth every blister.',
    mood: 'Transcendent',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    location: 'Laguna de los Tres Picos Summit',
  },
  {
    id: 'journal-006',
    tripId: 'trip-008',
    tripTitle: 'Paris Art & Culture Week',
    destination: 'Paris, France',
    date: '2026-10-12',
    dayNumber: 5,
    title: 'Louvre After Dark',
    entry:
      'Private after-hours tour of the Louvre. Just us and the Mona Lisa. Walking through empty galleries where millions walk daily—it felt like stepping into a secret. The Winged Victory of Samothrace is even more powerful when you\'re alone with it. Art needs silence to be truly heard.',
    mood: 'Inspired',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760566f3?w=600',
    location: 'Louvre Museum, After Hours',
  },
  {
    id: 'journal-007',
    tripId: 'trip-014',
    tripTitle: 'Cappadocia Hot Air Balloon Dawn',
    destination: 'Cappadocia, Turkey',
    date: '2026-06-18',
    dayNumber: 4,
    title: 'Floating Above Dreams',
    entry:
      'Hot air balloon launch at 5 AM. As we lifted off, the entire landscape revealed itself—thousands of fairy chimneys glowing in golden light. Felt weightless. Felt tiny. Felt alive. The pilot said in his 20 years, he\'d never seen conditions this perfect. I believe it. This memory will live in my bones forever.',
    mood: 'Euphoric',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600',
    location: 'Cappadocia Skies',
  },
  {
    id: 'journal-008',
    tripId: 'trip-009',
    tripTitle: 'Maldives Overwater Luxury',
    destination: 'Male, Maldives',
    date: '2026-05-18',
    dayNumber: 4,
    title: 'Ocean Floor Revelation',
    entry:
      'Snorkeled into a house reef at sunset. Parrotfish, manta rays, bioluminescent plankton. Went under the water and didn\'t want to come back up. The ocean felt like another planet. The guide said we were in a conservation zone—these reefs might not survive the next 20 years. Felt gratitude mixed with grief. Travel isn\'t always about joy.',
    mood: 'Bittersweet',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600',
    location: 'Maldives House Reef',
  },
  {
    id: 'journal-009',
    tripId: 'trip-012',
    tripTitle: 'Canadian Banff National Park',
    destination: 'Banff, Canada',
    date: '2026-08-05',
    dayNumber: 5,
    title: 'Lake Louise Magic',
    entry:
      'Paddled out on Lake Louise at sunrise. The water was glass. Mount Victoria reflected perfectly. We were the only canoe on the entire lake. Felt like paddling through a photograph. Our guide said this was one of the best visibility days he\'d seen all summer. Nature showed up exactly as needed.',
    mood: 'Peaceful',
    imageUrl: 'https://images.unsplash.com/photo-1511576661531-b34c7cb5f4a9?w=600',
    location: 'Lake Louise',
  },
  {
    id: 'journal-010',
    tripId: 'trip-015',
    tripTitle: 'Rome Historical Deep Dive',
    destination: 'Rome, Italy',
    date: '2026-09-16',
    dayNumber: 5,
    title: 'Colosseum Underground Secrets',
    entry:
      'Underground access to the Colosseum. Walking through tunnels where gladiators once walked. Saw animal cages, trapdoor mechanisms, ancient graffiti. Touching 2,000-year-old stone while crowds roared above. This is why Rome changes you—history isn\'t abstract here. It\'s beneath your feet.',
    mood: 'Humbled',
    imageUrl: 'https://images.unsplash.com/photo-1552832860-cfaf67ef42f9?w=600',
    location: 'Colosseum Underground',
  },
];

// ============================================================================
// DESTINATION HIGHLIGHTS (Popular destinations with stats)
// ============================================================================

export const popularDestinations = [
  {
    id: 'dest-001',
    name: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9d1?w=600',
    rating: 4.8,
    reviews: 15600,
    visits: 342000,
    bestMonths: ['March-May', 'October-November'],
    popularTags: ['Urban', 'Food', 'Technology', 'Culture'],
    averageCost: 'Medium',
  },
  {
    id: 'dest-002',
    name: 'Reykjavik',
    country: 'Iceland',
    region: 'North Atlantic',
    image: 'https://images.unsplash.com/photo-1504681869696-d977e9d34ac4?w=600',
    rating: 4.7,
    reviews: 12400,
    visits: 268000,
    bestMonths: ['December-February (Aurora)', 'June-August (Midnight Sun)'],
    popularTags: ['Aurora', 'Nature', 'Adventure', 'Winter'],
    averageCost: 'High',
  },
  {
    id: 'dest-003',
    name: 'Paris',
    country: 'France',
    region: 'Western Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760566f3?w=600',
    rating: 4.6,
    reviews: 28900,
    visits: 487000,
    bestMonths: ['April-May', 'September-October'],
    popularTags: ['Art', 'Romance', 'Food', 'History'],
    averageCost: 'High',
  },
  {
    id: 'dest-004',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537225228614-b6f3424ca6a2?w=600',
    rating: 4.5,
    reviews: 34200,
    visits: 612000,
    bestMonths: ['April-June', 'September-November'],
    popularTags: ['Budget', 'Beach', 'Wellness', 'Culture'],
    averageCost: 'Budget',
  },
  {
    id: 'dest-005',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453475868-9dcd1b7660d3?w=600',
    rating: 4.4,
    reviews: 18600,
    visits: 298000,
    bestMonths: ['November-April'],
    popularTags: ['Luxury', 'Beach', 'Shopping', 'Modern'],
    averageCost: 'High',
  },
];

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export const mockData = {
  plannedTrips,
  communityFeed,
  travelActivities,
  budgetBreakdowns,
  userProfiles,
  packingLists,
  tripJournalEntries,
  popularDestinations,
};

export default mockData;
