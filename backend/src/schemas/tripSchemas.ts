import { z } from 'zod';

export const currencyCodeSchema = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase());

export const createTripSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  startDate: z.string().date().optional().nullable(),
  endDate: z.string().date().optional().nullable(),
  budget: z.coerce.number().min(0).default(0),
  coverImageUrl: z.string().url().optional().nullable(),
  currencyCode: currencyCodeSchema.default('USD'),
});

export const updateTripSchema = createTripSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  'At least one field is required',
);

export const createStopSchema = z.object({
  cityId: z.string().uuid(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  transportCost: z.coerce.number().min(0).default(0),
  stayCost: z.coerce.number().min(0).default(0),
  notes: z.string().trim().max(600).optional().nullable(),
});

export const updateStopSchema = z
  .object({
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
    stopOrder: z.coerce.number().int().positive().optional(),
    transportCost: z.coerce.number().min(0).optional(),
    stayCost: z.coerce.number().min(0).optional(),
    notes: z.string().trim().max(600).optional().nullable(),
  })
  .refine((payload) => Object.keys(payload).length > 0, 'At least one field is required');

export const reorderStopsSchema = z.object({
  stopIds: z.array(z.string().uuid()).min(1),
});

export const createActivitySchema = z.object({
  activityCatalogId: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(2).max(140),
  category: z.string().trim().min(2).max(80),
  scheduledDate: z.string().date(),
  scheduledTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .optional()
    .nullable(),
  durationMinutes: z.coerce.number().int().positive().max(1440).default(60),
  estimatedCost: z.coerce.number().min(0).default(0),
  description: z.string().trim().max(1000).optional().nullable(),
});

export const updateActivitySchema = createActivitySchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  'At least one field is required',
);

export const cityQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  country: z.string().trim().max(80).optional(),
  region: z.string().trim().max(80).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(25),
});

export const activityCatalogQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  cityId: z.string().uuid().optional(),
  category: z.string().trim().max(80).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(25),
});
