export type Visibility = 'private' | 'public';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface TripSummary {
  id: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  budget: number;
  currencyCode: string;
  coverImageUrl: string | null;
  visibility: Visibility;
  destinationCount: number;
  createdAt: string;
}

export interface StopSummary {
  id: string;
  itineraryId: string;
  cityId: string;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  stopOrder: number;
  transportCost: number;
  stayCost: number;
  notes: string | null;
}

export interface ActivitySummary {
  id: string;
  stopId: string;
  activityCatalogId: string | null;
  title: string;
  category: string;
  scheduledDate: string;
  scheduledTime: string | null;
  durationMinutes: number;
  estimatedCost: number;
  description: string | null;
}

export interface BudgetBreakdown {
  tripId: string;
  currencyCode: string;
  budgetLimit: number;
  totals: {
    transport: number;
    stay: number;
    meals: number;
    activities: number;
    total: number;
  };
  averageCostPerDay: number;
  dailyBudgetTarget: number;
  dailyBreakdown: Array<{
    date: string;
    total: number;
    transport: number;
    stay: number;
    meals: number;
    activities: number;
    overBudget: boolean;
  }>;
}
