import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TripBudgetPage from './page';
import { renderWithQueryClient } from '../../../../test-utils/render';

const { budgetMock } = vi.hoisted(() => ({
  budgetMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ tripId: 'trip-1' }),
}));

vi.mock('../../../../components/app-shell', () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../../../components/auth-gate', () => ({
  AuthGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../../lib/api-client', () => ({
  tripApi: {
    budget: budgetMock,
  },
}));

describe('Budget page', () => {
  it('renders budget totals and daily rows', async () => {
    budgetMock.mockResolvedValue({
      tripId: 'trip-1',
      currencyCode: 'USD',
      budgetLimit: 1000,
      totals: {
        transport: 100,
        stay: 350,
        meals: 150,
        activities: 200,
        total: 800,
      },
      averageCostPerDay: 400,
      dailyBudgetTarget: 500,
      dailyBreakdown: [
        {
          date: '2026-08-01',
          total: 450,
          transport: 100,
          stay: 200,
          meals: 50,
          activities: 100,
          overBudget: false,
        },
        {
          date: '2026-08-02',
          total: 550,
          transport: 0,
          stay: 150,
          meals: 100,
          activities: 300,
          overBudget: true,
        },
      ],
    });

    renderWithQueryClient(<TripBudgetPage />);

    expect(await screen.findByText('Daily Breakdown')).toBeInTheDocument();
    expect(await screen.findByText('$800.00')).toBeInTheDocument();
    expect(await screen.findByText(/Budget target\/day/i)).toBeInTheDocument();
  });
});
