import { Router } from 'express';
import {
  activityCatalogHandler,
  addActivityHandler,
  addStopHandler,
  budgetHandler,
  citySearchHandler,
  copyPublicTripHandler,
  createTripHandler,
  deleteActivityHandler,
  deleteStopHandler,
  deleteTripHandler,
  getTripHandler,
  getTripListHandler,
  listActivitiesHandler,
  listStopsHandler,
  publicFeedHandler,
  publicTripHandler,
  publishShareHandler,
  reorderStopsHandler,
  updateActivityHandler,
  updateStopHandler,
  updateTripHandler,
} from '../controllers/tripController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authRequired } from '../middleware/authRequired';

export const tripRouter = Router();
export const stopRouter = Router();
export const activityRouter = Router();
export const catalogRouter = Router();
export const publicRouter = Router();

tripRouter.use(authRequired);
stopRouter.use(authRequired);
activityRouter.use(authRequired);

tripRouter.get('/', asyncHandler(getTripListHandler));
tripRouter.post('/', asyncHandler(createTripHandler));
tripRouter.get('/:tripId', asyncHandler(getTripHandler));
tripRouter.patch('/:tripId', asyncHandler(updateTripHandler));
tripRouter.delete('/:tripId', asyncHandler(deleteTripHandler));

tripRouter.get('/:tripId/stops', asyncHandler(listStopsHandler));
tripRouter.post('/:tripId/stops', asyncHandler(addStopHandler));
tripRouter.patch('/:tripId/stops/reorder', asyncHandler(reorderStopsHandler));

tripRouter.get('/:tripId/budget', asyncHandler(budgetHandler));
tripRouter.post('/:tripId/share', asyncHandler(publishShareHandler));

stopRouter.patch('/:stopId', asyncHandler(updateStopHandler));
stopRouter.delete('/:stopId', asyncHandler(deleteStopHandler));
stopRouter.get('/:stopId/activities', asyncHandler(listActivitiesHandler));
stopRouter.post('/:stopId/activities', asyncHandler(addActivityHandler));

activityRouter.patch('/:activityId', asyncHandler(updateActivityHandler));
activityRouter.delete('/:activityId', asyncHandler(deleteActivityHandler));

catalogRouter.get('/cities', asyncHandler(citySearchHandler));
catalogRouter.get('/activities/catalog', asyncHandler(activityCatalogHandler));

publicRouter.get('/', asyncHandler(publicFeedHandler));
publicRouter.get('/:slug', asyncHandler(publicTripHandler));
publicRouter.post('/:slug/copy', authRequired, asyncHandler(copyPublicTripHandler));
