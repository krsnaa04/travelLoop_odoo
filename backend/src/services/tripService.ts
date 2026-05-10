import { randomUUID } from 'node:crypto';
import { query } from '../db/connection';
import { withTransaction } from '../db/transaction';
import type { ActivitySummary, BudgetBreakdown, StopSummary, TripSummary } from '../contracts';
import { AppError, forbidden, notFound } from '../errors';
import { buildShareSlug } from '../utils/slug';

interface TripRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: string;
  currency_code: string;
  cover_image_url: string | null;
  visibility: 'private' | 'public';
  created_at: string;
  destination_count?: string;
}

interface StopRow {
  id: string;
  itinerary_id: string;
  city_id: string;
  city_name: string;
  country: string;
  start_date: string;
  end_date: string;
  stop_order: number;
  transport_cost: string;
  stay_cost: string;
  notes: string | null;
}

interface ActivityRow {
  id: string;
  stop_id: string;
  activity_catalog_id: string | null;
  title: string;
  category: string;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_minutes: number;
  estimated_cost: string;
  description: string | null;
}

interface CityRow {
  id: string;
  name: string;
  country: string;
  region: string | null;
  popularity_score: number;
  cost_index: number;
  daily_meal_estimate: string;
  description: string | null;
}

interface CatalogActivityRow {
  id: string;
  city_id: string | null;
  city_name: string | null;
  title: string;
  category: string;
  default_duration_minutes: number;
  estimated_cost: string;
  description: string | null;
  popularity_score: number;
}

const toNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

const mapTrip = (row: TripRow): TripSummary => ({
  id: row.id,
  title: row.title,
  description: row.description,
  startDate: row.start_date,
  endDate: row.end_date,
  budget: toNumber(row.budget),
  currencyCode: row.currency_code,
  coverImageUrl: row.cover_image_url,
  visibility: row.visibility,
  destinationCount: Number(row.destination_count ?? 0),
  createdAt: row.created_at,
});

const mapStop = (row: StopRow): StopSummary => ({
  id: row.id,
  itineraryId: row.itinerary_id,
  cityId: row.city_id,
  cityName: row.city_name,
  country: row.country,
  startDate: row.start_date,
  endDate: row.end_date,
  stopOrder: row.stop_order,
  transportCost: toNumber(row.transport_cost),
  stayCost: toNumber(row.stay_cost),
  notes: row.notes,
});

const mapActivity = (row: ActivityRow): ActivitySummary => ({
  id: row.id,
  stopId: row.stop_id,
  activityCatalogId: row.activity_catalog_id,
  title: row.title,
  category: row.category,
  scheduledDate: row.scheduled_date,
  scheduledTime: row.scheduled_time,
  durationMinutes: row.duration_minutes,
  estimatedCost: toNumber(row.estimated_cost),
  description: row.description,
});

const validateDateRange = (start: string, end: string) => {
  if (new Date(end).valueOf() < new Date(start).valueOf()) {
    throw new AppError('End date must be on or after start date');
  }
};

const findOwnedTrip = async (tripId: string, userId: string) => {
  const trip = await query<TripRow>(
    `
      SELECT id, user_id, title, description, start_date, end_date, budget, currency_code, cover_image_url, visibility, created_at
      FROM itineraries
      WHERE id = $1
    `,
    [tripId],
  );

  const row = trip.rows[0];
  if (!row) {
    throw notFound('Trip');
  }
  if (row.user_id !== userId) {
    throw forbidden();
  }

  return row;
};

const findOwnedStop = async (stopId: string, userId: string) => {
  const stop = await query<StopRow & { user_id: string }>(
    `
      SELECT
        s.id,
        s.itinerary_id,
        s.city_id,
        c.name AS city_name,
        c.country,
        s.start_date,
        s.end_date,
        s.stop_order,
        s.transport_cost,
        s.stay_cost,
        s.notes,
        i.user_id
      FROM trip_stops s
      INNER JOIN itineraries i ON i.id = s.itinerary_id
      INNER JOIN city_catalog c ON c.id = s.city_id
      WHERE s.id = $1
    `,
    [stopId],
  );
  const row = stop.rows[0];
  if (!row) {
    throw notFound('Stop');
  }
  if (row.user_id !== userId) {
    throw forbidden();
  }
  return row;
};

const findOwnedActivity = async (activityId: string, userId: string) => {
  const activity = await query<ActivityRow & { user_id: string; itinerary_id: string }>(
    `
      SELECT
        a.id,
        a.stop_id,
        a.activity_catalog_id,
        a.title,
        a.category,
        a.scheduled_date,
        a.scheduled_time,
        a.duration_minutes,
        a.estimated_cost,
        a.description,
        i.user_id,
        i.id AS itinerary_id
      FROM trip_activities a
      INNER JOIN trip_stops s ON s.id = a.stop_id
      INNER JOIN itineraries i ON i.id = s.itinerary_id
      WHERE a.id = $1
    `,
    [activityId],
  );

  const row = activity.rows[0];
  if (!row) {
    throw notFound('Activity');
  }
  if (row.user_id !== userId) {
    throw forbidden();
  }
  return row;
};

export const getTrips = async (userId: string) => {
  const result = await query<TripRow>(
    `
      SELECT
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.start_date,
        i.end_date,
        i.budget,
        i.currency_code,
        i.cover_image_url,
        i.visibility,
        i.created_at,
        COALESCE(COUNT(s.id), 0) AS destination_count
      FROM itineraries i
      LEFT JOIN trip_stops s ON s.itinerary_id = i.id
      WHERE i.user_id = $1
      GROUP BY i.id
      ORDER BY COALESCE(i.start_date, CURRENT_DATE + INTERVAL '100 years') ASC, i.created_at DESC
    `,
    [userId],
  );

  return result.rows.map(mapTrip);
};

export const getTrip = async (tripId: string, userId: string) => {
  await findOwnedTrip(tripId, userId);
  const result = await query<TripRow>(
    `
      SELECT
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.start_date,
        i.end_date,
        i.budget,
        i.currency_code,
        i.cover_image_url,
        i.visibility,
        i.created_at,
        COALESCE(COUNT(s.id), 0) AS destination_count
      FROM itineraries i
      LEFT JOIN trip_stops s ON s.itinerary_id = i.id
      WHERE i.id = $1
      GROUP BY i.id
    `,
    [tripId],
  );

  return mapTrip(result.rows[0]);
};

export const createTrip = async (
  userId: string,
  payload: {
    title: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    budget: number;
    coverImageUrl?: string | null;
    currencyCode: string;
  },
) => {
  if (payload.startDate && payload.endDate) {
    validateDateRange(payload.startDate, payload.endDate);
  }

  const result = await query<TripRow>(
    `
      INSERT INTO itineraries (
        id, user_id, title, description, start_date, end_date, budget, cover_image_url, currency_code, visibility
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'private')
      RETURNING id, user_id, title, description, start_date, end_date, budget, currency_code, cover_image_url, visibility, created_at
    `,
    [
      randomUUID(),
      userId,
      payload.title,
      payload.description ?? null,
      payload.startDate ?? null,
      payload.endDate ?? null,
      payload.budget,
      payload.coverImageUrl ?? null,
      payload.currencyCode,
    ],
  );

  return mapTrip({ ...result.rows[0], destination_count: '0' });
};

export const updateTrip = async (
  tripId: string,
  userId: string,
  payload: Partial<{
    title: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    budget: number;
    coverImageUrl: string | null;
    currencyCode: string;
  }>,
) => {
  const current = await findOwnedTrip(tripId, userId);
  const nextStartDate = payload.startDate ?? current.start_date;
  const nextEndDate = payload.endDate ?? current.end_date;
  if (nextStartDate && nextEndDate) {
    validateDateRange(nextStartDate, nextEndDate);
  }

  const result = await query<TripRow>(
    `
      UPDATE itineraries
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        budget = COALESCE($5, budget),
        cover_image_url = COALESCE($6, cover_image_url),
        currency_code = COALESCE($7, currency_code),
        updated_at = NOW()
      WHERE id = $8
      RETURNING id, user_id, title, description, start_date, end_date, budget, currency_code, cover_image_url, visibility, created_at
    `,
    [
      payload.title ?? null,
      payload.description ?? null,
      payload.startDate ?? null,
      payload.endDate ?? null,
      payload.budget ?? null,
      payload.coverImageUrl ?? null,
      payload.currencyCode ?? null,
      tripId,
    ],
  );

  const withCount = await query<TripRow>(
    `
      SELECT
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.start_date,
        i.end_date,
        i.budget,
        i.currency_code,
        i.cover_image_url,
        i.visibility,
        i.created_at,
        COALESCE(COUNT(s.id), 0) AS destination_count
      FROM itineraries i
      LEFT JOIN trip_stops s ON s.itinerary_id = i.id
      WHERE i.id = $1
      GROUP BY i.id
    `,
    [tripId],
  );

  return mapTrip(withCount.rows[0] ?? { ...result.rows[0], destination_count: '0' });
};

export const deleteTrip = async (tripId: string, userId: string) => {
  await findOwnedTrip(tripId, userId);
  await query('DELETE FROM itineraries WHERE id = $1', [tripId]);
};

export const listStops = async (tripId: string, userId: string) => {
  await findOwnedTrip(tripId, userId);
  const result = await query<StopRow>(
    `
      SELECT
        s.id,
        s.itinerary_id,
        s.city_id,
        c.name AS city_name,
        c.country,
        s.start_date,
        s.end_date,
        s.stop_order,
        s.transport_cost,
        s.stay_cost,
        s.notes
      FROM trip_stops s
      INNER JOIN city_catalog c ON c.id = s.city_id
      WHERE s.itinerary_id = $1
      ORDER BY s.stop_order ASC
    `,
    [tripId],
  );
  return result.rows.map(mapStop);
};

const normalizeStopOrder = async (tripId: string) => {
  const stops = await query<{ id: string }>(
    `
      SELECT id
      FROM trip_stops
      WHERE itinerary_id = $1
      ORDER BY stop_order ASC, created_at ASC
    `,
    [tripId],
  );

  if (stops.rows.length === 0) return;

  await withTransaction(async (tx) => {
    await tx('UPDATE trip_stops SET stop_order = stop_order + 1000 WHERE itinerary_id = $1', [tripId]);
    let order = 1;
    for (const row of stops.rows) {
      await tx('UPDATE trip_stops SET stop_order = $1, updated_at = NOW() WHERE id = $2', [order, row.id]);
      order += 1;
    }
  });
};

export const addStop = async (
  tripId: string,
  userId: string,
  payload: { cityId: string; startDate: string; endDate: string; transportCost: number; stayCost: number; notes?: string | null },
) => {
  await findOwnedTrip(tripId, userId);
  validateDateRange(payload.startDate, payload.endDate);

  const city = await query<CityRow>('SELECT * FROM city_catalog WHERE id = $1', [payload.cityId]);
  if (!city.rowCount) {
    throw notFound('City');
  }

  const orderResult = await query<{ next_order: number }>(
    'SELECT COALESCE(MAX(stop_order), 0) + 1 AS next_order FROM trip_stops WHERE itinerary_id = $1',
    [tripId],
  );
  const nextOrder = Number(orderResult.rows[0]?.next_order ?? 1);

  const inserted = await query<StopRow>(
    `
      INSERT INTO trip_stops (
        id, itinerary_id, city_id, start_date, end_date, stop_order, transport_cost, stay_cost, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        itinerary_id,
        city_id,
        $10::text AS city_name,
        $11::text AS country,
        start_date,
        end_date,
        stop_order,
        transport_cost,
        stay_cost,
        notes
    `,
    [
      randomUUID(),
      tripId,
      payload.cityId,
      payload.startDate,
      payload.endDate,
      nextOrder,
      payload.transportCost,
      payload.stayCost,
      payload.notes ?? null,
      city.rows[0].name,
      city.rows[0].country,
    ],
  );

  await normalizeStopOrder(tripId);
  return listStops(tripId, userId).then((stops) => stops.find((stop) => stop.id === inserted.rows[0].id) ?? mapStop(inserted.rows[0]));
};

const reorderStopsByIds = async (tripId: string, stopIds: string[]) => {
  await withTransaction(async (tx) => {
    await tx('UPDATE trip_stops SET stop_order = stop_order + 1000 WHERE itinerary_id = $1', [tripId]);
    for (let i = 0; i < stopIds.length; i += 1) {
      await tx('UPDATE trip_stops SET stop_order = $1, updated_at = NOW() WHERE id = $2 AND itinerary_id = $3', [i + 1, stopIds[i], tripId]);
    }
  });
};

export const reorderStops = async (tripId: string, userId: string, stopIds: string[]) => {
  await findOwnedTrip(tripId, userId);
  const existing = await listStops(tripId, userId);
  if (existing.length !== stopIds.length) {
    throw new AppError('stopIds must include every stop for the trip');
  }
  const existingSet = new Set(existing.map((stop) => stop.id));
  for (const id of stopIds) {
    if (!existingSet.has(id)) {
      throw new AppError('stopIds contains an unknown stop ID');
    }
  }
  await reorderStopsByIds(tripId, stopIds);
  return listStops(tripId, userId);
};

export const updateStop = async (
  stopId: string,
  userId: string,
  payload: Partial<{ startDate: string; endDate: string; stopOrder: number; transportCost: number; stayCost: number; notes: string | null }>,
) => {
  const existing = await findOwnedStop(stopId, userId);
  const nextStartDate = payload.startDate ?? existing.start_date;
  const nextEndDate = payload.endDate ?? existing.end_date;
  validateDateRange(nextStartDate, nextEndDate);

  await query(
    `
      UPDATE trip_stops
      SET
        start_date = COALESCE($1, start_date),
        end_date = COALESCE($2, end_date),
        transport_cost = COALESCE($3, transport_cost),
        stay_cost = COALESCE($4, stay_cost),
        notes = COALESCE($5, notes),
        updated_at = NOW()
      WHERE id = $6
    `,
    [
      payload.startDate ?? null,
      payload.endDate ?? null,
      payload.transportCost ?? null,
      payload.stayCost ?? null,
      payload.notes ?? null,
      stopId,
    ],
  );

  if (payload.stopOrder !== undefined) {
    const stops = await listStops(existing.itinerary_id, userId);
    const currentIndex = stops.findIndex((stop) => stop.id === stopId);
    const nextIndex = Math.max(0, Math.min(stops.length - 1, payload.stopOrder - 1));
    if (currentIndex >= 0 && currentIndex !== nextIndex) {
      const reordered = [...stops];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(nextIndex, 0, moved);
      await reorderStopsByIds(existing.itinerary_id, reordered.map((stop) => stop.id));
    }
  }

  const refreshed = await listStops(existing.itinerary_id, userId);
  const stop = refreshed.find((item) => item.id === stopId);
  if (!stop) {
    throw notFound('Stop');
  }
  return stop;
};

export const deleteStop = async (stopId: string, userId: string) => {
  const existing = await findOwnedStop(stopId, userId);
  await query('DELETE FROM trip_stops WHERE id = $1', [stopId]);
  await normalizeStopOrder(existing.itinerary_id);
};

export const listActivities = async (stopId: string, userId: string) => {
  await findOwnedStop(stopId, userId);
  const result = await query<ActivityRow>(
    `
      SELECT
        id,
        stop_id,
        activity_catalog_id,
        title,
        category,
        scheduled_date,
        scheduled_time,
        duration_minutes,
        estimated_cost,
        description
      FROM trip_activities
      WHERE stop_id = $1
      ORDER BY scheduled_date ASC, scheduled_time ASC NULLS LAST, created_at ASC
    `,
    [stopId],
  );
  return result.rows.map(mapActivity);
};

export const addActivity = async (
  stopId: string,
  userId: string,
  payload: {
    activityCatalogId?: string | null;
    title: string;
    category: string;
    scheduledDate: string;
    scheduledTime?: string | null;
    durationMinutes: number;
    estimatedCost: number;
    description?: string | null;
  },
) => {
  const stop = await findOwnedStop(stopId, userId);
  if (payload.scheduledDate < stop.start_date || payload.scheduledDate > stop.end_date) {
    throw new AppError('Activity date must be within stop dates');
  }

  const result = await query<ActivityRow>(
    `
      INSERT INTO trip_activities (
        id, stop_id, activity_catalog_id, title, category, scheduled_date, scheduled_time, duration_minutes, estimated_cost, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, stop_id, activity_catalog_id, title, category, scheduled_date, scheduled_time, duration_minutes, estimated_cost, description
    `,
    [
      randomUUID(),
      stopId,
      payload.activityCatalogId ?? null,
      payload.title,
      payload.category,
      payload.scheduledDate,
      payload.scheduledTime ?? null,
      payload.durationMinutes,
      payload.estimatedCost,
      payload.description ?? null,
    ],
  );
  return mapActivity(result.rows[0]);
};

export const updateActivity = async (
  activityId: string,
  userId: string,
  payload: Partial<{
    activityCatalogId: string | null;
    title: string;
    category: string;
    scheduledDate: string;
    scheduledTime: string | null;
    durationMinutes: number;
    estimatedCost: number;
    description: string | null;
  }>,
) => {
  const existing = await findOwnedActivity(activityId, userId);
  const stop = await findOwnedStop(existing.stop_id, userId);
  const nextDate = payload.scheduledDate ?? existing.scheduled_date;
  if (nextDate < stop.start_date || nextDate > stop.end_date) {
    throw new AppError('Activity date must be within stop dates');
  }

  const result = await query<ActivityRow>(
    `
      UPDATE trip_activities
      SET
        activity_catalog_id = COALESCE($1, activity_catalog_id),
        title = COALESCE($2, title),
        category = COALESCE($3, category),
        scheduled_date = COALESCE($4, scheduled_date),
        scheduled_time = COALESCE($5, scheduled_time),
        duration_minutes = COALESCE($6, duration_minutes),
        estimated_cost = COALESCE($7, estimated_cost),
        description = COALESCE($8, description),
        updated_at = NOW()
      WHERE id = $9
      RETURNING id, stop_id, activity_catalog_id, title, category, scheduled_date, scheduled_time, duration_minutes, estimated_cost, description
    `,
    [
      payload.activityCatalogId ?? null,
      payload.title ?? null,
      payload.category ?? null,
      payload.scheduledDate ?? null,
      payload.scheduledTime ?? null,
      payload.durationMinutes ?? null,
      payload.estimatedCost ?? null,
      payload.description ?? null,
      activityId,
    ],
  );

  return mapActivity(result.rows[0]);
};

export const deleteActivity = async (activityId: string, userId: string) => {
  await findOwnedActivity(activityId, userId);
  await query('DELETE FROM trip_activities WHERE id = $1', [activityId]);
};

export const searchCities = async (filters: { q?: string; country?: string; region?: string; limit: number }) => {
  const params: unknown[] = [];
  const where: string[] = [];
  let i = 1;

  if (filters.q) {
    params.push(`%${filters.q}%`);
    where.push(`(name ILIKE $${i} OR country ILIKE $${i})`);
    i += 1;
  }
  if (filters.country) {
    params.push(filters.country);
    where.push(`country = $${i}`);
    i += 1;
  }
  if (filters.region) {
    params.push(filters.region);
    where.push(`region = $${i}`);
    i += 1;
  }

  params.push(filters.limit);
  const sql = `
    SELECT id, name, country, region, popularity_score, cost_index, daily_meal_estimate, description
    FROM city_catalog
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY popularity_score DESC, name ASC
    LIMIT $${i}
  `;

  const result = await query<CityRow>(sql, params);
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    country: row.country,
    region: row.region,
    popularityScore: row.popularity_score,
    costIndex: row.cost_index,
    dailyMealEstimate: toNumber(row.daily_meal_estimate),
    description: row.description,
  }));
};

export const searchActivityCatalog = async (filters: { q?: string; cityId?: string; category?: string; limit: number }) => {
  const params: unknown[] = [];
  const where: string[] = [];
  let i = 1;

  if (filters.q) {
    params.push(`%${filters.q}%`);
    where.push(`(a.title ILIKE $${i} OR a.category ILIKE $${i})`);
    i += 1;
  }
  if (filters.cityId) {
    params.push(filters.cityId);
    where.push(`a.city_id = $${i}`);
    i += 1;
  }
  if (filters.category) {
    params.push(filters.category);
    where.push(`a.category = $${i}`);
    i += 1;
  }

  params.push(filters.limit);
  const sql = `
    SELECT
      a.id,
      a.city_id,
      c.name AS city_name,
      a.title,
      a.category,
      a.default_duration_minutes,
      a.estimated_cost,
      a.description,
      a.popularity_score
    FROM activity_catalog a
    LEFT JOIN city_catalog c ON c.id = a.city_id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY a.popularity_score DESC, a.title ASC
    LIMIT $${i}
  `;

  const result = await query<CatalogActivityRow>(sql, params);
  return result.rows.map((row) => ({
    id: row.id,
    cityId: row.city_id,
    cityName: row.city_name,
    title: row.title,
    category: row.category,
    defaultDurationMinutes: row.default_duration_minutes,
    estimatedCost: toNumber(row.estimated_cost),
    description: row.description,
    popularityScore: row.popularity_score,
  }));
};

const enumerateDates = (start: string, end: string) => {
  const dates: string[] = [];
  const cursor = new Date(`${start}T00:00:00.000Z`);
  const max = new Date(`${end}T00:00:00.000Z`);
  while (cursor <= max) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
};

export const getBudgetBreakdown = async (tripId: string, userId: string): Promise<BudgetBreakdown> => {
  const trip = await findOwnedTrip(tripId, userId);
  const stops = await query<
    StopRow & {
      daily_meal_estimate: string;
    }
  >(
    `
      SELECT
        s.id,
        s.itinerary_id,
        s.city_id,
        c.name AS city_name,
        c.country,
        s.start_date,
        s.end_date,
        s.stop_order,
        s.transport_cost,
        s.stay_cost,
        s.notes,
        c.daily_meal_estimate
      FROM trip_stops s
      INNER JOIN city_catalog c ON c.id = s.city_id
      WHERE s.itinerary_id = $1
      ORDER BY s.stop_order ASC
    `,
    [tripId],
  );

  const activities = await query<ActivityRow & { itinerary_id: string }>(
    `
      SELECT
        a.id,
        a.stop_id,
        a.activity_catalog_id,
        a.title,
        a.category,
        a.scheduled_date,
        a.scheduled_time,
        a.duration_minutes,
        a.estimated_cost,
        a.description,
        s.itinerary_id
      FROM trip_activities a
      INNER JOIN trip_stops s ON s.id = a.stop_id
      WHERE s.itinerary_id = $1
    `,
    [tripId],
  );

  const perDay = new Map<
    string,
    {
      transport: number;
      stay: number;
      meals: number;
      activities: number;
    }
  >();

  let totalTransport = 0;
  let totalStay = 0;
  let totalMeals = 0;
  let totalActivities = 0;

  for (const stop of stops.rows) {
    const days = enumerateDates(stop.start_date, stop.end_date);
    const stayPerDay = days.length > 0 ? toNumber(stop.stay_cost) / days.length : 0;
    const mealPerDay = toNumber(stop.daily_meal_estimate);
    totalTransport += toNumber(stop.transport_cost);
    totalStay += toNumber(stop.stay_cost);
    totalMeals += mealPerDay * days.length;

    days.forEach((date, idx) => {
      const current = perDay.get(date) ?? {
        transport: 0,
        stay: 0,
        meals: 0,
        activities: 0,
      };
      current.stay += stayPerDay;
      current.meals += mealPerDay;
      if (idx === 0) {
        current.transport += toNumber(stop.transport_cost);
      }
      perDay.set(date, current);
    });
  }

  for (const activity of activities.rows) {
    const current = perDay.get(activity.scheduled_date) ?? {
      transport: 0,
      stay: 0,
      meals: 0,
      activities: 0,
    };
    const activityCost = toNumber(activity.estimated_cost);
    current.activities += activityCost;
    totalActivities += activityCost;
    perDay.set(activity.scheduled_date, current);
  }

  const dailyBudgetTarget = perDay.size > 0 && toNumber(trip.budget) > 0 ? toNumber(trip.budget) / perDay.size : 0;
  const dailyBreakdown = Array.from(perDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => {
      const total = value.transport + value.stay + value.meals + value.activities;
      return {
        date,
        total,
        transport: value.transport,
        stay: value.stay,
        meals: value.meals,
        activities: value.activities,
        overBudget: dailyBudgetTarget > 0 ? total > dailyBudgetTarget : false,
      };
    });

  const total = totalTransport + totalStay + totalMeals + totalActivities;

  return {
    tripId,
    currencyCode: trip.currency_code,
    budgetLimit: toNumber(trip.budget),
    totals: {
      transport: totalTransport,
      stay: totalStay,
      meals: totalMeals,
      activities: totalActivities,
      total,
    },
    averageCostPerDay: dailyBreakdown.length > 0 ? total / dailyBreakdown.length : total,
    dailyBudgetTarget,
    dailyBreakdown,
  };
};

export const publishShareLink = async (tripId: string, userId: string) => {
  const trip = await findOwnedTrip(tripId, userId);

  const existing = await query<{ slug: string }>('SELECT slug FROM share_links WHERE itinerary_id = $1', [tripId]);
  if (existing.rowCount) {
    await query("UPDATE itineraries SET visibility = 'public' WHERE id = $1", [tripId]);
    return { slug: existing.rows[0].slug };
  }

  let slug = buildShareSlug(trip.title);
  let attempts = 0;
  while (attempts < 5) {
    try {
      await query(
        `
          INSERT INTO share_links (id, itinerary_id, slug, is_public)
          VALUES ($1, $2, $3, TRUE)
        `,
        [randomUUID(), tripId, slug],
      );
      await query("UPDATE itineraries SET visibility = 'public' WHERE id = $1", [tripId]);
      return { slug };
    } catch {
      attempts += 1;
      slug = buildShareSlug(`${trip.title}-${attempts + 1}`);
    }
  }

  throw new AppError('Could not create share link. Please try again.');
};

export const getPublicItinerary = async (slug: string) => {
  const trip = await query<
    TripRow & {
      owner_name: string | null;
      share_slug: string;
    }
  >(
    `
      SELECT
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.start_date,
        i.end_date,
        i.budget,
        i.currency_code,
        i.cover_image_url,
        i.visibility,
        i.created_at,
        u.name AS owner_name,
        s.slug AS share_slug
      FROM itineraries i
      INNER JOIN share_links s ON s.itinerary_id = i.id AND s.is_public = TRUE
      INNER JOIN users u ON u.id = i.user_id
      WHERE s.slug = $1
    `,
    [slug],
  );

  const tripRow = trip.rows[0];
  if (!tripRow) {
    throw notFound('Shared trip');
  }

  const stops = await query<StopRow>(
    `
      SELECT
        s.id,
        s.itinerary_id,
        s.city_id,
        c.name AS city_name,
        c.country,
        s.start_date,
        s.end_date,
        s.stop_order,
        s.transport_cost,
        s.stay_cost,
        s.notes
      FROM trip_stops s
      INNER JOIN city_catalog c ON c.id = s.city_id
      WHERE s.itinerary_id = $1
      ORDER BY s.stop_order ASC
    `,
    [tripRow.id],
  );

  const activities = await query<ActivityRow>(
    `
      SELECT
        a.id,
        a.stop_id,
        a.activity_catalog_id,
        a.title,
        a.category,
        a.scheduled_date,
        a.scheduled_time,
        a.duration_minutes,
        a.estimated_cost,
        a.description
      FROM trip_activities a
      INNER JOIN trip_stops s ON s.id = a.stop_id
      WHERE s.itinerary_id = $1
      ORDER BY a.scheduled_date ASC, a.scheduled_time ASC NULLS LAST
    `,
    [tripRow.id],
  );

  return {
    trip: mapTrip({ ...tripRow, destination_count: String(stops.rowCount ?? 0) }),
    ownerName: tripRow.owner_name,
    slug: tripRow.share_slug,
    stops: stops.rows.map(mapStop),
    activities: activities.rows.map(mapActivity),
  };
};

export const copyPublicTrip = async (slug: string, userId: string) => {
  const shared = await getPublicItinerary(slug);

  return withTransaction(async (tx) => {
    const newTripId = randomUUID();
    await tx(
      `
        INSERT INTO itineraries (
          id, user_id, title, description, start_date, end_date, budget, currency_code, cover_image_url, visibility
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'private')
      `,
      [
        newTripId,
        userId,
        `${shared.trip.title} (Copy)`,
        shared.trip.description,
        shared.trip.startDate,
        shared.trip.endDate,
        shared.trip.budget,
        shared.trip.currencyCode,
        shared.trip.coverImageUrl,
      ],
    );

    const stopIdMap = new Map<string, string>();
    for (const stop of shared.stops) {
      const nextStopId = randomUUID();
      stopIdMap.set(stop.id, nextStopId);
      await tx(
        `
          INSERT INTO trip_stops (
            id, itinerary_id, city_id, start_date, end_date, stop_order, transport_cost, stay_cost, notes
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [nextStopId, newTripId, stop.cityId, stop.startDate, stop.endDate, stop.stopOrder, stop.transportCost, stop.stayCost, stop.notes],
      );
    }

    for (const activity of shared.activities) {
      const mappedStopId = stopIdMap.get(activity.stopId);
      if (!mappedStopId) continue;
      await tx(
        `
          INSERT INTO trip_activities (
            id, stop_id, activity_catalog_id, title, category, scheduled_date, scheduled_time, duration_minutes, estimated_cost, description
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          randomUUID(),
          mappedStopId,
          activity.activityCatalogId,
          activity.title,
          activity.category,
          activity.scheduledDate,
          activity.scheduledTime,
          activity.durationMinutes,
          activity.estimatedCost,
          activity.description,
        ],
      );
    }

    return newTripId;
  });
};

export const listPublicTrips = async (limit = 20) => {
  const result = await query<
    TripRow & {
      owner_name: string | null;
      slug: string;
    }
  >(
    `
      SELECT
        i.id,
        i.user_id,
        i.title,
        i.description,
        i.start_date,
        i.end_date,
        i.budget,
        i.currency_code,
        i.cover_image_url,
        i.visibility,
        i.created_at,
        s.slug,
        u.name AS owner_name,
        COALESCE(COUNT(ts.id), 0) AS destination_count
      FROM share_links s
      INNER JOIN itineraries i ON i.id = s.itinerary_id
      INNER JOIN users u ON u.id = i.user_id
      LEFT JOIN trip_stops ts ON ts.itinerary_id = i.id
      WHERE s.is_public = TRUE
      GROUP BY i.id, s.slug, u.name
      ORDER BY i.created_at DESC
      LIMIT $1
    `,
    [limit],
  );

  return result.rows.map((row) => ({
    slug: row.slug,
    ownerName: row.owner_name,
    trip: mapTrip(row),
  }));
};
