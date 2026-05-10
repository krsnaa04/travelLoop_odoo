ALTER TABLE packing_items
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE trip_notes
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

UPDATE packing_items
SET user_id = itineraries.user_id
FROM itineraries
WHERE packing_items.itinerary_id = itineraries.id
  AND packing_items.user_id IS NULL;

UPDATE trip_notes
SET user_id = itineraries.user_id
FROM itineraries
WHERE trip_notes.itinerary_id = itineraries.id
  AND trip_notes.user_id IS NULL;

ALTER TABLE packing_items
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE trip_notes
  ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_packing_items_user_id ON packing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_notes_user_id ON trip_notes(user_id);
