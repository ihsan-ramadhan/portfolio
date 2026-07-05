import { describe, expect, it, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { messagesApi } from '../services/api.service';
import type { ContactMessage } from '../types';
import { renderHookWithQuery } from '../test/hook-test-utils';
import { useMessages, useMarkAsRead, useDeleteMessage } from './use-messages';

const mockMessage: ContactMessage = {
  id: 'm1',
  name: 'Tester',
  email: 't@x.dev',
  message: 'hi',
  isRead: false,
  createdAt: '2025-01-01T00:00:00Z',
};

describe('useMessages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('is disabled when token is empty', async () => {
    const spy = vi.spyOn(messagesApi, 'getMessages').mockResolvedValue([mockMessage]);
    const { result } = renderHookWithQuery(() => useMessages(''));

    // enabled=false means fetch is never called and stays idle
    expect(result.current.isFetching).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
  });

  it('fetches messages when token is provided', async () => {
    vi.spyOn(messagesApi, 'getMessages').mockResolvedValue([mockMessage]);
    const { result } = renderHookWithQuery(() => useMessages('tok'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockMessage]);
  });
});

describe('useMarkAsRead', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls api.markAsRead with id and token', async () => {
    const spy = vi.spyOn(messagesApi, 'markAsRead').mockResolvedValue({ ...mockMessage, isRead: true });
    const { result } = renderHookWithQuery(() => useMarkAsRead());

    await result.current.mutateAsync({ id: 'm1', token: 'tok' });

    expect(spy).toHaveBeenCalledWith({ id: 'm1', token: 'tok' });
  });
});

describe('useDeleteMessage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls api.deleteMessage with id and token', async () => {
    const spy = vi.spyOn(messagesApi, 'deleteMessage').mockResolvedValue();
    const { result } = renderHookWithQuery(() => useDeleteMessage());

    await result.current.mutateAsync({ id: 'm1', token: 'tok' });

    expect(spy).toHaveBeenCalledWith({ id: 'm1', token: 'tok' });
  });
});
