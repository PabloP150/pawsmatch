import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadPet } from '../services/petProvider';

const MOCK_IMAGE_URL = 'https://images.dog.ceo/breeds/retriever-golden/test.jpg';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ message: MOCK_IMAGE_URL, status: 'success' }),
  }));
});

describe('petProvider — Dog API integration', () => {
  it('loadPet returns null when index is out of bounds', async () => {
    const result = await loadPet(9999);
    expect(result).toBeNull();
  });

  it('loadPet merges local pet with API image URL', async () => {
    const result = await loadPet(0);
    expect(result).not.toBeNull();
    expect(result?.imageUrl).toBe(MOCK_IMAGE_URL);
    expect(result?.id).toBe(1);
    expect(result?.name).toBeTruthy();
    expect(result?.bio).toBeTruthy();
    expect(result?.breed).toBeTruthy();
  });

  it('loadPet calls the Dog API endpoint', async () => {
    await loadPet(0);
    expect(fetch).toHaveBeenCalledWith('https://dog.ceo/api/breeds/image/random');
  });

  it('loadPet throws when API returns non-ok HTTP status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(loadPet(0)).rejects.toThrow('503');
  });

  it('loadPet throws when API status field is not success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: '', status: 'error' }),
    }));
    await expect(loadPet(0)).rejects.toThrow();
  });
});
