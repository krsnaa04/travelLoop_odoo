import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './page';
import { useAuthStore } from '../../../lib/auth-store';
import { renderWithQueryClient } from '../../../test-utils/render';

const { pushMock, loginMock, forgotPasswordMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  loginMock: vi.fn(),
  forgotPasswordMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
  }),
}));

vi.mock('../../../lib/api-client', () => ({
  authApi: {
    login: loginMock,
    forgotPassword: forgotPasswordMock,
  },
}));

describe('Login page', () => {
  beforeEach(() => {
    pushMock.mockReset();
    loginMock.mockReset();
    forgotPasswordMock.mockReset();
    useAuthStore.setState({
      token: null,
      user: null,
      hydrated: true,
    });
  });

  it('shows validation error for invalid input', async () => {
    renderWithQueryClient(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'bad-email' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Please provide a valid email and password (6+ characters).')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('logs in successfully and redirects', async () => {
    loginMock.mockResolvedValue({
      token: 'test-token',
      user: { id: 'u1', email: 'demo@traveloop.com', name: 'Demo' },
    });

    renderWithQueryClient(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'demo@traveloop.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/dashboard'));
    expect(useAuthStore.getState().token).toBe('test-token');
  });
});
