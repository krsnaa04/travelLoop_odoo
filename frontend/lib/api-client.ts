'use client';

import axios, { type AxiosRequestConfig } from 'axios';
import { useAuthStore } from './auth-store';
import type {
  ActivityCatalogItem,
  ActivitySummary,
  AuthUser,
  BudgetBreakdown,
  CityCatalogItem,
  PublicTripPayload,
  StopSummary,
  TripSummary,
} from './contracts';

// Use local Next.js API routes for mock data in development
// In production, this can be overridden with NEXT_PUBLIC_API_URL
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? '/api';

const client = axios.create({
  baseURL: apiBaseUrl,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface DataEnvelope<T> {
  data: T;
}

const readData = <T>(response: { data: DataEnvelope<T> }) => response.data.data;

const request = async <T>(config: AxiosRequestConfig) => {
  const response = await client.request<DataEnvelope<T>>(config);
  return readData(response);
};

export const authApi = {
  register: async (payload: { email: string; password: string; name?: string }) => {
    const response = await client.post<{ token: string; user: AuthUser }>('/auth/register', payload);
    return response.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const response = await client.post<{ token: string; user: AuthUser }>('/auth/login', payload);
    return response.data;
  },
  me: async () => {
    const response = await client.get<{ user: AuthUser }>('/auth/me');
    return response.data.user;
  },
  forgotPassword: async (email: string) => {
    const response = await client.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },
};

export const tripApi = {
  list: () => request<TripSummary[]>({ method: 'GET', url: '/trips' }),
  create: (payload: {
    title: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    budget: number;
    coverImageUrl?: string | null;
    currencyCode: string;
  }) => request<TripSummary>({ method: 'POST', url: '/trips', data: payload }),
  get: (tripId: string) => request<TripSummary>({ method: 'GET', url: `/trips/${tripId}` }),
  update: (tripId: string, payload: Partial<{ title: string; description: string | null; startDate: string | null; endDate: string | null; budget: number; coverImageUrl: string | null; currencyCode: string }>) =>
    request<TripSummary>({ method: 'PATCH', url: `/trips/${tripId}`, data: payload }),
  remove: (tripId: string) => client.delete(`/trips/${tripId}`),
  listStops: (tripId: string) => request<StopSummary[]>({ method: 'GET', url: `/trips/${tripId}/stops` }),
  addStop: (
    tripId: string,
    payload: {
      cityId: string;
      startDate: string;
      endDate: string;
      transportCost: number;
      stayCost: number;
      notes?: string | null;
    },
  ) => request<StopSummary>({ method: 'POST', url: `/trips/${tripId}/stops`, data: payload }),
  reorderStops: (tripId: string, stopIds: string[]) => request<StopSummary[]>({ method: 'PATCH', url: `/trips/${tripId}/stops/reorder`, data: { stopIds } }),
  updateStop: (
    stopId: string,
    payload: Partial<{ startDate: string; endDate: string; stopOrder: number; transportCost: number; stayCost: number; notes: string | null }>,
  ) => request<StopSummary>({ method: 'PATCH', url: `/stops/${stopId}`, data: payload }),
  removeStop: (stopId: string) => client.delete(`/stops/${stopId}`),
  listActivities: (stopId: string) => request<ActivitySummary[]>({ method: 'GET', url: `/stops/${stopId}/activities` }),
  addActivity: (
    stopId: string,
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
  ) => request<ActivitySummary>({ method: 'POST', url: `/stops/${stopId}/activities`, data: payload }),
  updateActivity: (
    activityId: string,
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
  ) => request<ActivitySummary>({ method: 'PATCH', url: `/activities/${activityId}`, data: payload }),
  removeActivity: (activityId: string) => client.delete(`/activities/${activityId}`),
  budget: (tripId: string) => request<BudgetBreakdown>({ method: 'GET', url: `/trips/${tripId}/budget` }),
  share: (tripId: string) => request<{ slug: string }>({ method: 'POST', url: `/trips/${tripId}/share` }),
};

export const catalogApi = {
  cities: (params: { q?: string; country?: string; region?: string; limit?: number }) =>
    request<CityCatalogItem[]>({ method: 'GET', url: '/cities', params }),
  activities: (params: { q?: string; cityId?: string; category?: string; limit?: number }) =>
    request<ActivityCatalogItem[]>({ method: 'GET', url: '/activities/catalog', params }),
};

export const publicApi = {
  feed: () => request<Array<{ slug: string; ownerName: string | null; trip: TripSummary }>>({ method: 'GET', url: '/public' }),
  trip: (slug: string) => request<PublicTripPayload>({ method: 'GET', url: `/public/${slug}` }),
  copy: (slug: string) => request<{ tripId: string }>({ method: 'POST', url: `/public/${slug}/copy` }),
};
