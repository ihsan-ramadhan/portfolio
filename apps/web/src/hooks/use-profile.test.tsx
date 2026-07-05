
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useProfile } from './use-profile';
import { profileApi } from '../services/api.service';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProfile', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
    // Force no retries via setQueryDefaults
    queryClient.setQueryDefaults(['profile'], { retry: false });
  });

  it('fetches profile data successfully', async () => {
    const mockProfile = {
      headline: 'Dev',
      bio: 'Bio',
      location: 'Indonesia',
      photoUrl: 'photo.jpg',
      statusBadge: 'Active',
      tagline: 'Coding',
    };
    vi.spyOn(profileApi, 'getProfile').mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProfile);
    expect(profileApi.getProfile).toHaveBeenCalledTimes(1);
  });

  it('handles error when fetching profile data', async () => {
    const errorMessage = 'Network Error';
    vi.spyOn(profileApi, 'getProfile').mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(profileApi.getProfile).toHaveBeenCalledTimes(1);
  });
});
