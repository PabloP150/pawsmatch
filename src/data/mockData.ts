import type { Pet } from '../types/pet';
import petsJson from '../../asset-generation/pets.json';

export const pets: Pet[] = petsJson as Pet[];

export const getPetById = (id: number): Pet | undefined =>
  pets.find((pet) => pet.id === id);

export const getPetsByBreed = (breed: string): Pet[] =>
  pets.filter((pet) => pet.breed.toLowerCase().includes(breed.toLowerCase()));
