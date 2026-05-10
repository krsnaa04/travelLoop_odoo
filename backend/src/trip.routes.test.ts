import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from './errors';
import type { AuthUser } from './contracts';
import { signAuthToken } from './utils/jwt';

const service = {
  getTrips: vi.fn(),
  createTrip: vi.fn(),
  getTrip: vi.fn(),
  updateTrip: vi.fn(),
  deleteTrip: vi.fn(),
  listStops: vi.fn(),
  addStop: vi.fn(),
  reorderStops: vi.fn(),
  updateStop: vi.fn(),
  deleteStop: vi.fn(),
  listActivities: vi.fn(),
  addActivity: vi.fn(),
  updateActivity: vi.fn(),
  deleteActivity: vi.fn(),
  searchCities: vi.fn(),
  searchActivityCatalog: vi.fn(),
  getBudgetBreakdown: vi.fn(),
  publishShareLink: vi.fn(),
  getPublicItinerary: vi.fn(),
  copyPublicTrip: vi.fn(),
  listPublicTrips: vi.fn(),
};

vi.mock('./services/tripService', () => service);

describe('Trip routes', () => {
  const sampleUser: AuthUser = {
    id: 'd2aa5335-db8d-4c31-b685-86174c6cd45c',
    email: 'planner@traveloop.dev',
    name: 'Planner',
  };
  const token = signAuthToken(sampleUser);

  beforeEach(() => {
    Object.values(service).forEach((fn) => fn.mockReset());
  });

  it('requires auth for trip listing', async () => {
    const { app } = await import('./app');
    const response = await request(app).get('/api/trips');
    expect(response.status).toBe(401);
  });

  it('returns trips for authorized user', async () => {
    service.getTrips.mockResolvedValue([{ id: 'trip-1', title: 'Summer Trip' }]);
    const { app } = await import('./app');
    const response = await request(app).get('/api/trips').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(service.getTrips).toHaveBeenCalledWith(sampleUser.id);
  });

  it('creates a trip', async () => {
    service.createTrip.mockResolvedValue({ id: 'trip-2', title: 'New Adventure' });
    const { app } = await import('./app');
    const response = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Adventure',
        budget: 3000,
        currencyCode: 'USD',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe('trip-2');
  });

  it('rejects invalid stop reorder payload', async () => {
    const { app } = await import('./app');
    const response = await request(app)
      .patch('/api/trips/trip-2/stops/reorder')
      .set('Authorization', `Bearer ${token}`)
      .send({
        stopIds: [],
      });

    expect(response.status).toBe(400);
    expect(service.reorderStops).not.toHaveBeenCalled();
  });

  it('enforces ownership for trip access', async () => {
    service.getTrip.mockRejectedValue(new AppError('Forbidden', 403));
    const { app } = await import('./app');
    const response = await request(app).get('/api/trips/forbidden-trip').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });

  it('returns budget breakdown', async () => {
    service.getBudgetBreakdown.mockResolvedValue({
      tripId: 'trip-2',
      currencyCode: 'USD',
      budgetLimit: 1000,
      totals: { transport: 100, stay: 300, meals: 200, activities: 250, total: 850 },
      averageCostPerDay: 283.33,
      dailyBudgetTarget: 333.33,
      dailyBreakdown: [],
    });
    const { app } = await import('./app');
    const response = await request(app).get('/api/trips/trip-2/budget').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.totals.total).toBe(850);
  });

  it('serves public trip without auth', async () => {
    service.getPublicItinerary.mockResolvedValue({ trip: { id: 'trip-2', title: 'Shared' }, stops: [], activities: [] });
    const { app } = await import('./app');
    const response = await request(app).get('/api/public/shared-slug');
    expect(response.status).toBe(200);
    expect(response.body.data.trip.title).toBe('Shared');
  });

  it('requires auth to copy shared trip', async () => {
    const { app } = await import('./app');
    const response = await request(app).post('/api/public/shared-slug/copy');
    expect(response.status).toBe(401);
  });

  it('copies shared trip with auth', async () => {
    service.copyPublicTrip.mockResolvedValue('copied-trip');
    const { app } = await import('./app');
    const response = await request(app)
      .post('/api/public/shared-slug/copy')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.data.tripId).toBe('copied-trip');
  });
});
