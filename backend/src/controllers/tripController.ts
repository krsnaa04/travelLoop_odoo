import type { Request, Response } from 'express';
import { AppError } from '../errors';
import {
  activityCatalogQuerySchema,
  cityQuerySchema,
  createActivitySchema,
  createStopSchema,
  createTripSchema,
  reorderStopsSchema,
  updateActivitySchema,
  updateStopSchema,
  updateTripSchema,
} from '../schemas/tripSchemas';
import {
  addActivity,
  addStop,
  copyPublicTrip,
  createTrip,
  deleteActivity,
  deleteStop,
  deleteTrip,
  getBudgetBreakdown,
  getTrip,
  getTrips,
  listActivities,
  listPublicTrips,
  listStops,
  publishShareLink,
  reorderStops,
  searchActivityCatalog,
  searchCities,
  updateActivity,
  updateStop,
  updateTrip,
  getPublicItinerary,
} from '../services/tripService';

const requireUser = (req: Request) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  return req.user;
};

export const getTripListHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const trips = await getTrips(user.id);
  return res.json({ data: trips });
};

export const createTripHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const payload = createTripSchema.parse(req.body);
  const trip = await createTrip(user.id, payload);
  return res.status(201).json({ data: trip });
};

export const getTripHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const trip = await getTrip(req.params.tripId, user.id);
  return res.json({ data: trip });
};

export const updateTripHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const payload = updateTripSchema.parse(req.body);
  const trip = await updateTrip(req.params.tripId, user.id, payload);
  return res.json({ data: trip });
};

export const deleteTripHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  await deleteTrip(req.params.tripId, user.id);
  return res.status(204).send();
};

export const listStopsHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const stops = await listStops(req.params.tripId, user.id);
  return res.json({ data: stops });
};

export const addStopHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const payload = createStopSchema.parse(req.body);
  const stop = await addStop(req.params.tripId, user.id, payload);
  return res.status(201).json({ data: stop });
};

export const reorderStopsHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const payload = reorderStopsSchema.parse(req.body);
  const stops = await reorderStops(req.params.tripId, user.id, payload.stopIds);
  return res.json({ data: stops });
};

export const updateStopHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const payload = updateStopSchema.parse(req.body);
  const stop = await updateStop(req.params.stopId, user.id, payload);
  return res.json({ data: stop });
};

export const deleteStopHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  await deleteStop(req.params.stopId, user.id);
  return res.status(204).send();
};

export const listActivitiesHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const activities = await listActivities(req.params.stopId, user.id);
  return res.json({ data: activities });
};

export const addActivityHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const payload = createActivitySchema.parse(req.body);
  const activity = await addActivity(req.params.stopId, user.id, payload);
  return res.status(201).json({ data: activity });
};

export const updateActivityHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const payload = updateActivitySchema.parse(req.body);
  const activity = await updateActivity(req.params.activityId, user.id, payload);
  return res.json({ data: activity });
};

export const deleteActivityHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  await deleteActivity(req.params.activityId, user.id);
  return res.status(204).send();
};

export const citySearchHandler = async (req: Request, res: Response) => {
  const payload = cityQuerySchema.parse(req.query);
  const cities = await searchCities(payload);
  return res.json({ data: cities });
};

export const activityCatalogHandler = async (req: Request, res: Response) => {
  const payload = activityCatalogQuerySchema.parse(req.query);
  const activities = await searchActivityCatalog(payload);
  return res.json({ data: activities });
};

export const budgetHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const budget = await getBudgetBreakdown(req.params.tripId, user.id);
  return res.json({ data: budget });
};

export const publishShareHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const result = await publishShareLink(req.params.tripId, user.id);
  return res.json({ data: result });
};

export const publicTripHandler = async (req: Request, res: Response) => {
  const itinerary = await getPublicItinerary(req.params.slug);
  return res.json({ data: itinerary });
};

export const copyPublicTripHandler = async (req: Request, res: Response) => {
  const user = requireUser(req);
  const tripId = await copyPublicTrip(req.params.slug, user.id);
  return res.status(201).json({ data: { tripId } });
};

export const publicFeedHandler = async (_req: Request, res: Response) => {
  const items = await listPublicTrips(25);
  return res.json({ data: items });
};
