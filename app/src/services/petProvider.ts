import type { PetWithImage } from '../types/pet';
import { pets } from '../data/mockData';

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';

interface DogApiResponse {
  message: string;
  status: 'success' | 'error';
}

const fetchDogImage = async (): Promise<string> => {
  const res = await fetch(DOG_API_URL);
  if (!res.ok) throw new Error(`Dog API responded with ${res.status}`);
  const data: DogApiResponse = await res.json();
  if (data.status !== 'success') throw new Error('Dog API returned non-success status');
  return data.message;
};

/**
 * Loads a single PetWithImage by index.
 * Merges the local pets.json profile (bio, name, breed) with a real
 * dog photo from dog.ceo — the image URL lives at response.message.
 * Returns null when the deck is exhausted.
 */
export const loadPet = async (index: number): Promise<PetWithImage | null> => {
  if (index >= pets.length) return null;
  const pet = pets[index];
  const imageUrl = await fetchDogImage();
  return { ...pet, imageUrl };
};
