import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreateTripPage from './page';
import { renderWithQueryClient } from '../../../test-utils/render';

const { pushMock, createTripMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  createTripMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('../../../components/app-shell', () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../../components/auth-gate', () => ({
  AuthGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../lib/api-client', () => ({
  tripApi: {
    create: createTripMock,
  },
}));

describe('Create trip page', () => {
  beforeEach(() => {
    pushMock.mockReset();
    createTripMock.mockReset();
  });

  it('submits trip payload and redirects to builder', async () => {
    createTripMock.mockResolvedValue({ id: 'trip-123' });

    renderWithQueryClient(<CreateTripPage />);

    fireEvent.change(screen.getByPlaceholderText('Trip name'), { target: { value: 'Europe Sprint' } });
    fireEvent.change(screen.getByPlaceholderText('Currency (e.g. USD)'), { target: { value: 'usd' } });
    fireEvent.change(screen.getByPlaceholderText('Start date'), { target: { value: '2026-08-01' } });
    fireEvent.change(screen.getByPlaceholderText('End date'), { target: { value: '2026-08-10' } });
    fireEvent.change(screen.getByPlaceholderText('Budget'), { target: { value: '2500' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save trip' }));

    await waitFor(() => expect(createTripMock).toHaveBeenCalledTimes(1));
    expect(createTripMock.mock.calls[0][0]).toMatchObject({
      title: 'Europe Sprint',
      currencyCode: 'USD',
      budget: 2500,
      startDate: '2026-08-01',
      endDate: '2026-08-10',
    });
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/trips/trip-123/builder'));
  });
});
