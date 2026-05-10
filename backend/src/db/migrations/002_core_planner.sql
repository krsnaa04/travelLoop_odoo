ALTER TABLE itineraries
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS currency_code CHAR(3) NOT NULL DEFAULT 'USD';

CREATE TABLE IF NOT EXISTS city_catalog (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  popularity_score INTEGER NOT NULL DEFAULT 0 CHECK (popularity_score >= 0 AND popularity_score <= 100),
  cost_index INTEGER NOT NULL DEFAULT 50 CHECK (cost_index >= 0 AND cost_index <= 200),
  daily_meal_estimate NUMERIC(12,2) NOT NULL DEFAULT 30,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, country)
);

CREATE TABLE IF NOT EXISTS activity_catalog (
  id UUID PRIMARY KEY,
  city_id UUID REFERENCES city_catalog(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  default_duration_minutes INTEGER NOT NULL DEFAULT 120 CHECK (default_duration_minutes > 0),
  estimated_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  description TEXT,
  popularity_score INTEGER NOT NULL DEFAULT 0 CHECK (popularity_score >= 0 AND popularity_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trip_stops (
  id UUID PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES city_catalog(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  stop_order INTEGER NOT NULL CHECK (stop_order > 0),
  transport_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  stay_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT stop_dates_valid CHECK (end_date >= start_date),
  UNIQUE (itinerary_id, stop_order)
);

CREATE TABLE IF NOT EXISTS trip_activities (
  id UUID PRIMARY KEY,
  stop_id UUID NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_catalog_id UUID REFERENCES activity_catalog(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  estimated_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY,
  itinerary_id UUID NOT NULL UNIQUE REFERENCES itineraries(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packing_items (
  id UUID PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  is_packed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trip_notes (
  id UUID PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_stop_id UUID REFERENCES trip_stops(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  noted_on DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_itinerary_id ON trip_stops(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_stop_id ON trip_activities(stop_id);
CREATE INDEX IF NOT EXISTS idx_packing_items_user_id ON packing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_notes_user_id ON trip_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_catalog_city_id ON activity_catalog(city_id);
CREATE INDEX IF NOT EXISTS idx_share_links_slug ON share_links(slug);

INSERT INTO city_catalog (id, name, country, region, popularity_score, cost_index, daily_meal_estimate, description)
VALUES
  ('a10a1111-1111-4111-8111-111111111111', 'Paris', 'France', 'Europe', 96, 85, 65, 'Historic city of lights, art, and cafe culture'),
  ('a20a2222-2222-4222-8222-222222222222', 'Tokyo', 'Japan', 'Asia', 95, 88, 55, 'Modern-meets-traditional metropolis with world-class food'),
  ('a30a3333-3333-4333-8333-333333333333', 'New York', 'United States', 'North America', 94, 90, 70, 'Fast-paced global city for culture, food, and skylines'),
  ('a40a4444-4444-4444-8444-444444444444', 'Bali', 'Indonesia', 'Asia', 89, 52, 35, 'Island destination with beaches, temples, and nature'),
  ('a50a5555-5555-4555-8555-555555555555', 'Dubai', 'United Arab Emirates', 'Middle East', 90, 82, 60, 'Luxury destination with modern attractions and desert tours'),
  ('a60a6666-6666-4666-8666-666666666666', 'Singapore', 'Singapore', 'Asia', 87, 80, 50, 'Clean and efficient city with gardens and great transit')
ON CONFLICT (name, country) DO NOTHING;

INSERT INTO activity_catalog (id, city_id, title, category, default_duration_minutes, estimated_cost, description, popularity_score)
VALUES
  ('b1001111-1111-4111-8111-111111111111', 'a10a1111-1111-4111-8111-111111111111', 'Eiffel Tower Summit Visit', 'sightseeing', 150, 42, 'Iconic tower visit with city views', 95),
  ('b1002222-2222-4222-8222-222222222222', 'a10a1111-1111-4111-8111-111111111111', 'Seine River Evening Cruise', 'leisure', 120, 35, 'Scenic Paris river cruise', 88),
  ('b2001111-1111-4111-8111-111111111111', 'a20a2222-2222-4222-8222-222222222222', 'Tsukiji Food Walk', 'food', 180, 48, 'Guided street food and market tour', 90),
  ('b2002222-2222-4222-8222-222222222222', 'a20a2222-2222-4222-8222-222222222222', 'Shibuya + Harajuku Highlights', 'sightseeing', 210, 28, 'Landmark walking route across major neighborhoods', 86),
  ('b3001111-1111-4111-8111-111111111111', 'a30a3333-3333-4333-8333-333333333333', 'Broadway Night Show', 'entertainment', 180, 120, 'Popular musical theater performance', 92),
  ('b3002222-2222-4222-8222-222222222222', 'a30a3333-3333-4333-8333-333333333333', 'Central Park Bike Tour', 'adventure', 150, 45, 'Bike ride covering top park landmarks', 83),
  ('b4001111-1111-4111-8111-111111111111', 'a40a4444-4444-4444-8444-444444444444', 'Ubud Rice Terrace Tour', 'nature', 180, 22, 'Cultural and nature half-day trip', 84),
  ('b4002222-2222-4222-8222-222222222222', 'a40a4444-4444-4444-8444-444444444444', 'Sunset Beach Club Pass', 'leisure', 240, 32, 'Relaxed sunset session at beach club', 81),
  ('b5001111-1111-4111-8111-111111111111', 'a50a5555-5555-4555-8555-555555555555', 'Desert Safari Experience', 'adventure', 300, 75, 'Dune drive and dinner experience', 93),
  ('b5002222-2222-4222-8222-222222222222', 'a50a5555-5555-4555-8555-555555555555', 'Dubai Marina Cruise Dinner', 'food', 150, 68, 'Evening cruise with buffet dinner', 85),
  ('b6001111-1111-4111-8111-111111111111', 'a60a6666-6666-4666-8666-666666666666', 'Gardens by the Bay Visit', 'sightseeing', 180, 30, 'Explore supertrees and conservatories', 89),
  ('b6002222-2222-4222-8222-222222222222', 'a60a6666-6666-4666-8666-666666666666', 'Hawker Center Food Crawl', 'food', 120, 26, 'Taste local dishes across top stalls', 87)
ON CONFLICT DO NOTHING;
