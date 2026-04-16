import type { Pet } from '../types/pet';
import { pets } from '../data/mockData';

export const fetchPets = async (): Promise<Pet[]> => {
  // Simulates async API call — swap for real fetch when backend is ready
  return Promise.resolve(pets);
};

export const fetchPetById = async (id: number): Promise<Pet> => {
  const pet = pets.find((p) => p.id === id);
  if (!pet) throw new Error(`Pet with id ${id} not found`);
  return Promise.resolve(pet);
};
