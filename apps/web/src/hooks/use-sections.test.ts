import { describe, expect, it, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { sectionsApi } from '../services/api.service';
import type { SiteSection } from '../types';
import { renderHookWithQuery } from '../test/hook-test-utils';
import { useSections, useUpdateSection, useReorderSections } from './use-sections';

const mockSection: SiteSection = {
  id: 's1',
  name: 'about',
  isEnabled: true,
  order: 1,
};

describe('useSections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches the section list', async () => {
    vi.spyOn(sectionsApi, 'getSections').mockResolvedValue([mockSection]);
    const { result } = renderHookWithQuery(() => useSections());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockSection]);
  });
});

describe('useUpdateSection', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls api with id, data, and token', async () => {
    const spy = vi
      .spyOn(sectionsApi, 'updateSection')
      .mockResolvedValue({ ...mockSection, isEnabled: false });
    const { result } = renderHookWithQuery(() => useUpdateSection());

    await result.current.mutateAsync({ id: 's1', data: { isEnabled: false }, token: 'tok' });

    expect(spy).toHaveBeenCalledWith({ id: 's1', data: { isEnabled: false }, token: 'tok' });
  });

  it('invalidates the sections query on success', async () => {
    vi.spyOn(sectionsApi, 'getSections').mockResolvedValue([mockSection]);
    vi.spyOn(sectionsApi, 'updateSection').mockResolvedValue(mockSection);
    const { result } = renderHookWithQuery(() => useUpdateSection());

    await result.current.mutateAsync({ id: 's1', data: { isEnabled: false }, token: 'tok' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useReorderSections', () => {
  beforeEach(() => vi.clearAllMocks());

  it('forwards the new order to the api', async () => {
    const spy = vi.spyOn(sectionsApi, 'reorderSections').mockResolvedValue([mockSection]);
    const { result } = renderHookWithQuery(() => useReorderSections());

    const sections = [
      { name: 'about', order: 2 },
      { name: 'skills', order: 1 },
    ];
    await result.current.mutateAsync({ sections, token: 'tok' });

    expect(spy).toHaveBeenCalledWith({ sections, token: 'tok' });
  });
});
