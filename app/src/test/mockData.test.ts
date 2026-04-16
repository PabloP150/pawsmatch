import { describe, it, expect } from 'vitest';
import { pets, getPetById, getPetsByBreed } from '../data/mockData';

describe('Pet catalog (mockData)', () => {
  it('contains 50 dog profiles', () => {
    expect(pets).toHaveLength(50);
  });

  it('every pet has required fields: id, name, bio, breed', () => {
    pets.forEach((pet) => {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('name');
      expect(pet).toHaveProperty('bio');
      expect(pet).toHaveProperty('breed');
    });
  });

  it('pet ids are unique', () => {
    const ids = pets.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(pets.length);
  });

  it('getPetById returns the correct pet', () => {
    const pet = getPetById(1);
    expect(pet).toBeDefined();
    expect(pet?.id).toBe(1);
  });

  it('getPetById returns undefined for unknown id', () => {
    expect(getPetById(9999)).toBeUndefined();
  });

  it('getPetsByBreed filters case-insensitively', () => {
    const firstBreed = pets[0].breed;
    const results = getPetsByBreed(firstBreed.slice(0, 3));
    expect(results.length).toBeGreaterThan(0);
    results.forEach((p) => {
      expect(p.breed.toLowerCase()).toContain(firstBreed.slice(0, 3).toLowerCase());
    });
  });
});
