import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ItineraryBuilderPage from './page';
import { renderWithQueryClient } from '../../../../test-utils/render';

const { getTripMock, listStopsMock, addStopMock, listActivitiesMock, citiesMock, activitiesCatalogMock } = vi.hoisted(() => ({
  getTripMock: vi.fn(),
  listStopsMock: vi.fn(),
  addStopMock: vi.fn(),
  listActivitiesMock: vi.fn(),
  citiesMock: vi.fn(),
  activitiesCatalogMock: vi.fn(),
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
    get: getTripMock,
    listStops: listStopsMock,
    addStop: addStopMock,
    reorderStops: vi.fn(),
    removeStop: vi.fn(),
    addActivity: vi.fn(),
    listActivities: listActivitiesMock,
    removeActivity: vi.fn(),
  },
  catalogApi: {
    cities: citiesMock,
    activities: activitiesCatalogMock,
  },
}));

describe('Itinerary builder page', () => {
  beforeEach(() => {
    getTripMock.mockReset();
    listStopsMock.mockReset();
    addStopMock.mockReset();
    listActivitiesMock.mockReset();
    citiesMock.mockReset();
    activitiesCatalogMock.mockReset();

    getTripMock.mockResolvedValue({
      id: 'trip-1',
      title: 'Tokyo + Singapore',
      currencyCode: 'USD',
      budget: 2000,
    });
    listStopsMock.mockResolvedValue([]);
    listActivitiesMock.mockResolvedValue([]);
    addStopMock.mockResolvedValue({
      id: 'stop-1',
      stopOrder: 1,
      cityId: 'city-1',
      cityName: 'Tokyo',
      country: 'Japan',
      startDate: '2026-09-01',
      endDate: '2026-09-03',
      transportCost: 100,
      stayCost: 300,
      notes: null,
    });
    citiesMock.mockResolvedValue([
      {
        id: 'city-1',
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        popularityScore: 95,
        costIndex: 88,
        dailyMealEstimate: 55,
      },
    ]);
    activitiesCatalogMock.mockResolvedValue([]);
  });

  it('adds a stop from builder form', async () => {
    const view = renderWithQueryClient(<ItineraryBuilderPage />);

    fireEvent.change(await screen.findByPlaceholderText('Search city (Paris, Tokyo...)'), { target: { value: 'Tokyo' } });
    fireEvent.click(await screen.findByText('Tokyo, Japan | cost index 88'));
    const dateInputs = view.container.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: '2026-09-01' } });
    fireEvent.change(dateInputs[1], { target: { value: '2026-09-03' } });
    fireEvent.change(screen.getByPlaceholderText('Transport cost'), { target: { value: '100' } });
    fireEvent.change(screen.getByPlaceholderText('Stay cost'), { target: { value: '300' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add stop' }));

    await waitFor(() => expect(addStopMock).toHaveBeenCalledTimes(1));
    expect(addStopMock).toHaveBeenCalledWith('trip-1', expect.objectContaining({ cityId: 'city-1' }));
  });
});
