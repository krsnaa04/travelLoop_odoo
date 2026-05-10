import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { query } from '../db/connection';
import { AppError, notFound } from '../errors';
import type { AuthUser } from '../contracts';

const DEMO_USER = {
  id: 'f56e6f83-14f6-4f4f-b88c-b9a5d1fc1a01',
  email: 'demo@traveloop.com',
  name: 'Demo Traveler',
  passwordHash: bcrypt.hashSync('demo123', 10),
};

const DEMO_TRIPS = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Tokyo Neon Dreams',
    description: 'Solo city immersion with ramen counters, design districts, and late-night skyline energy.',
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    budget: 4200,
    currencyCode: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1540959375944-7049f642e9d1?w=1200',
    visibility: 'private',
    stops: [
      {
        id: '21111111-1111-4111-8111-111111111111',
        cityId: 'a20a2222-2222-4222-8222-222222222222',
        startDate: '2026-10-12',
        endDate: '2026-10-18',
        stopOrder: 1,
        transportCost: 860,
        stayCost: 1650,
        notes: 'Base at a design hotel in Shibuya and work from quiet cafes after sunrise.'
      },
    ],
    activities: [
      {
        id: '31111111-1111-4111-8111-111111111111',
        stopId: '21111111-1111-4111-8111-111111111111',
        activityCatalogId: 'b2001111-1111-4111-8111-111111111111',
        title: 'Tsukiji Food Walk',
        category: 'food',
        scheduledDate: '2026-10-13',
        scheduledTime: '07:30:00',
        durationMinutes: 180,
        estimatedCost: 48,
        description: 'Market breakfast crawl with fresh sushi and local tea.'
      },
      {
        id: '31111111-1111-4111-8111-111111111112',
        stopId: '21111111-1111-4111-8111-111111111111',
        activityCatalogId: 'b2002222-2222-4222-8222-222222222222',
        title: 'Shibuya + Harajuku Highlights',
        category: 'sightseeing',
        scheduledDate: '2026-10-15',
        scheduledTime: '15:00:00',
        durationMinutes: 210,
        estimatedCost: 28,
        description: 'Neon crossings, fashion lanes, and a slow coffee stop.'
      },
    ],
    packing: [
      ['Clothing', 'Light layers, one sharp dinner outfit, foldable umbrella'],
      ['Tech', 'Portable charger, camera, power adapter'],
      ['Documents', 'Passport, train passes, travel insurance'],
    ],
    note: 'First trip on the account. Keep it flexible and leave room for unplanned nights out.',
    slug: 'tokyo-neon-dreams',
    public: false,
  },
  {
    id: '11111111-1111-4111-8111-111111111112',
    title: 'Paris Art & Culture Week',
    description: 'Slow mornings, gallery afternoons, and golden hour along the Seine.',
    startDate: '2026-11-05',
    endDate: '2026-11-11',
    budget: 3600,
    currencyCode: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760566f3?w=1200',
    visibility: 'private',
    stops: [
      {
        id: '21111111-1111-4111-8111-111111111112',
        cityId: 'a10a1111-1111-4111-8111-111111111111',
        startDate: '2026-11-05',
        endDate: '2026-11-11',
        stopOrder: 1,
        transportCost: 640,
        stayCost: 1840,
        notes: 'Stay near the Marais for easy access to galleries and hidden wine bars.'
      },
    ],
    activities: [
      {
        id: '31111111-1111-4111-8111-111111111113',
        stopId: '21111111-1111-4111-8111-111111111112',
        activityCatalogId: 'b1001111-1111-4111-8111-111111111111',
        title: 'Eiffel Tower Summit Visit',
        category: 'sightseeing',
        scheduledDate: '2026-11-06',
        scheduledTime: '18:00:00',
        durationMinutes: 150,
        estimatedCost: 42,
        description: 'Sunset summit with skyline views and a long walk home.'
      },
      {
        id: '31111111-1111-4111-8111-111111111114',
        stopId: '21111111-1111-4111-8111-111111111112',
        activityCatalogId: 'b1002222-2222-4222-8222-222222222222',
        title: 'Seine River Evening Cruise',
        category: 'leisure',
        scheduledDate: '2026-11-08',
        scheduledTime: '20:00:00',
        durationMinutes: 120,
        estimatedCost: 35,
        description: 'Night cruise with city lights and quiet wine tasting.'
      },
    ],
    packing: [
      ['Clothing', 'Neutral jackets, knitwear, evening shoes'],
      ['Lifestyle', 'Sketchbook, book, compact camera'],
      ['Documents', 'Passport, museum reservations, hotel confirmations'],
    ],
    note: 'A slower trip built around art, food, and long walks between neighborhoods.',
    slug: 'paris-art-culture-week',
    public: true,
  },
  {
    id: '11111111-1111-4111-8111-111111111113',
    title: 'Bali Digital Nomad Haven',
    description: 'A month of work sessions, rice terraces, wellness mornings, and late surf evenings.',
    startDate: '2026-09-01',
    endDate: '2026-09-28',
    budget: 2400,
    currencyCode: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1537225228614-b6f3424ca6a2?w=1200',
    visibility: 'private',
    stops: [
      {
        id: '21111111-1111-4111-8111-111111111113',
        cityId: 'a40a4444-4444-4444-8444-444444444444',
        startDate: '2026-09-01',
        endDate: '2026-09-21',
        stopOrder: 1,
        transportCost: 380,
        stayCost: 720,
        notes: 'Base in Ubud for coworking and calm mornings.'
      },
      {
        id: '21111111-1111-4111-8111-111111111114',
        cityId: 'a60a6666-6666-4666-8666-666666666666',
        startDate: '2026-09-22',
        endDate: '2026-09-28',
        stopOrder: 2,
        transportCost: 220,
        stayCost: 540,
        notes: 'Finish in Singapore for a polished city reset before flying home.'
      },
    ],
    activities: [
      {
        id: '31111111-1111-4111-8111-111111111115',
        stopId: '21111111-1111-4111-8111-111111111113',
        activityCatalogId: 'b4001111-1111-4111-8111-111111111111',
        title: 'Ubud Rice Terrace Tour',
        category: 'nature',
        scheduledDate: '2026-09-03',
        scheduledTime: '07:00:00',
        durationMinutes: 180,
        estimatedCost: 22,
        description: 'Sunrise terrace walk and local coffee tasting.'
      },
      {
        id: '31111111-1111-4111-8111-111111111116',
        stopId: '21111111-1111-4111-8111-111111111114',
        activityCatalogId: 'b6001111-1111-4111-8111-111111111111',
        title: 'Gardens by the Bay Visit',
        category: 'sightseeing',
        scheduledDate: '2026-09-24',
        scheduledTime: '19:00:00',
        durationMinutes: 180,
        estimatedCost: 30,
        description: 'Evening light show and rooftop dinner afterward.'
      },
    ],
    packing: [
      ['Clothing', 'Breathable shirts, swimwear, one polished meeting outfit'],
      ['Work Gear', 'Laptop, hotspot, noise-canceling headphones'],
      ['Wellness', 'Yoga mat, reusable bottle, sunscreen'],
    ],
    note: 'Designed to feel like a real remote-work month, not a vacation sprint.',
    slug: 'bali-digital-nomad-haven',
    public: false,
  },
  {
    id: '11111111-1111-4111-8111-111111111114',
    title: 'Dubai Luxury Escape',
    description: 'High-touch city break with skyline dining, desert light, and one polished celebratory night.',
    startDate: '2026-12-10',
    endDate: '2026-12-15',
    budget: 5800,
    currencyCode: 'USD',
    coverImageUrl: 'https://images.unsplash.com/photo-1512453670132-b35b0d0d0d0c?w=1200',
    visibility: 'private',
    stops: [
      {
        id: '21111111-1111-4111-8111-111111111115',
        cityId: 'a50a5555-5555-4555-8555-555555555555',
        startDate: '2026-12-10',
        endDate: '2026-12-15',
        stopOrder: 1,
        transportCost: 1200,
        stayCost: 2400,
        notes: 'Keep this one polished: one great hotel, one great restaurant per night.'
      },
    ],
    activities: [
      {
        id: '31111111-1111-4111-8111-111111111117',
        stopId: '21111111-1111-4111-8111-111111111115',
        activityCatalogId: 'b5001111-1111-4111-8111-111111111111',
        title: 'Desert Safari Experience',
        category: 'adventure',
        scheduledDate: '2026-12-12',
        scheduledTime: '15:00:00',
        durationMinutes: 300,
        estimatedCost: 75,
        description: 'Dunes, dinner, and a cinematic sunset over the desert.'
      },
      {
        id: '31111111-1111-4111-8111-111111111118',
        stopId: '21111111-1111-4111-8111-111111111115',
        activityCatalogId: 'b5002222-2222-4222-8222-222222222222',
        title: 'Dubai Marina Cruise Dinner',
        category: 'food',
        scheduledDate: '2026-12-13',
        scheduledTime: '19:30:00',
        durationMinutes: 150,
        estimatedCost: 68,
        description: 'Dinner cruise with skyline views and a quiet night cap.'
      },
    ],
    packing: [
      ['Clothing', 'Tailored dinnerwear, light layers, walking sneakers'],
      ['Documents', 'Passport, hotel confirmations, lounge card'],
      ['Tech', 'Camera, portable charger, adapter'],
    ],
    note: 'The most polished trip in the account, built for a premium feel.',
    slug: 'dubai-luxury-escape',
    public: true,
  },
];

const ensureDemoWorkspace = async () => {
  const existing = await query<{ id: string }>('SELECT id FROM itineraries WHERE user_id = $1 LIMIT 1', [DEMO_USER.id]);
  if (existing.rowCount) {
    return;
  }

  for (const trip of DEMO_TRIPS) {
    await query(
      `
        INSERT INTO itineraries (id, user_id, title, description, start_date, end_date, budget, cover_image_url, currency_code, visibility)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [trip.id, DEMO_USER.id, trip.title, trip.description, trip.startDate, trip.endDate, trip.budget, trip.coverImageUrl, trip.currencyCode, trip.visibility],
    );

    for (const stop of trip.stops) {
      await query(
        `
          INSERT INTO trip_stops (id, itinerary_id, city_id, start_date, end_date, stop_order, transport_cost, stay_cost, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [stop.id, trip.id, stop.cityId, stop.startDate, stop.endDate, stop.stopOrder, stop.transportCost, stop.stayCost, stop.notes],
      );
    }

    for (const activity of trip.activities) {
      await query(
        `
          INSERT INTO trip_activities (id, stop_id, activity_catalog_id, title, category, scheduled_date, scheduled_time, duration_minutes, estimated_cost, description)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [activity.id, activity.stopId, activity.activityCatalogId, activity.title, activity.category, activity.scheduledDate, activity.scheduledTime, activity.durationMinutes, activity.estimatedCost, activity.description],
      );
    }

    for (const [category, title] of trip.packing) {
      await query(
        `
          INSERT INTO packing_items (id, itinerary_id, user_id, title, category, is_packed)
          VALUES ($1, $2, $3, $4, $5, FALSE)
        `,
        [randomUUID(), trip.id, DEMO_USER.id, title, category],
      );
    }

    await query(
      `
        INSERT INTO trip_notes (id, itinerary_id, user_id, trip_stop_id, body, noted_on)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
      `,
      [randomUUID(), trip.id, DEMO_USER.id, trip.stops[0]?.id ?? null, trip.note],
    );

    if (trip.public) {
      await query(
        `
          INSERT INTO share_links (id, itinerary_id, slug, is_public)
          VALUES ($1, $2, $3, TRUE)
          ON CONFLICT (itinerary_id) DO UPDATE SET slug = EXCLUDED.slug, is_public = TRUE
        `,
        [randomUUID(), trip.id, trip.slug],
      );
      await query("UPDATE itineraries SET visibility = 'public' WHERE id = $1", [trip.id]);
    }
  }
};

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
}

const mapUser = (row: UserRow): AuthUser => ({
  id: row.id,
  email: row.email,
  name: row.name,
});

const ensureDemoUser = async () => {
  await query(
    `
      INSERT INTO users (id, email, password_hash, name, avatar_url)
      VALUES ($1, $2, $3, $4, NULL)
      ON CONFLICT (id)
      DO UPDATE SET
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        updated_at = NOW()
    `,
    [DEMO_USER.id, DEMO_USER.email, DEMO_USER.passwordHash, DEMO_USER.name],
  );
};

export const registerUser = async (input: { email: string; password: string; name?: string }) => {
  if (input.email === DEMO_USER.email) {
    throw new AppError('This email is reserved for the demo account', 409);
  }

  const existing = await query<UserRow>('SELECT id, email, name, password_hash FROM users WHERE email = $1', [input.email]);
  if (existing.rowCount) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const insert = await query<UserRow>(
    `
      INSERT INTO users (id, email, password_hash, name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, password_hash
    `,
    [randomUUID(), input.email, hashedPassword, input.name ?? null],
  );

  return mapUser(insert.rows[0]);
};

export const loginUser = async (input: { email: string; password: string }) => {
  if (input.email === DEMO_USER.email) {
    await ensureDemoUser();
    await ensureDemoWorkspace();
  }

  const existing = await query<UserRow>('SELECT id, email, name, password_hash FROM users WHERE email = $1', [input.email]);
  const row = existing.rows[0];
  if (!row) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await bcrypt.compare(input.password, row.password_hash);
  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  return mapUser(row);
};

export const getUserById = async (userId: string) => {
  const existing = await query<UserRow>('SELECT id, email, name, password_hash FROM users WHERE id = $1', [userId]);
  const row = existing.rows[0];
  if (!row) {
    throw notFound('User');
  }
  return mapUser(row);
};
