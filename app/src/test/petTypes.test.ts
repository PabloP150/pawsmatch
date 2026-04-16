import { describe, it, expect } from 'vitest';
import type { Pet, PetWithImage, SwipeDecision, MatchResult } from '../types/pet';

describe('Pet type contracts', () => {
  it('Pet interface has correct shape', () => {
    const pet: Pet = { id: 1, name: 'Luna', bio: 'Bio de prueba', breed: 'Labrador' };
    expect(pet.id).toBe(1);
    expect(pet.name).toBe('Luna');
    expect(pet.bio).toBe('Bio de prueba');
    expect(pet.breed).toBe('Labrador');
  });

  it('PetWithImage extends Pet with imageUrl', () => {
    const pet: PetWithImage = {
      id: 2,
      name: 'Bruno',
      bio: 'Bio de prueba',
      breed: 'Bulldog',
      imageUrl: 'https://images.dog.ceo/breeds/bulldog/test.jpg',
    };
    expect(pet.imageUrl).toMatch(/^https?:\/\//);
  });

  it('SwipeDecision is either like or pass', () => {
    const like: SwipeDecision = 'like';
    const pass: SwipeDecision = 'pass';
    expect(['like', 'pass']).toContain(like);
    expect(['like', 'pass']).toContain(pass);
  });

  it('MatchResult links a pet to a decision and timestamp', () => {
    const pet: PetWithImage = {
      id: 3, name: 'Max', bio: 'Bio', breed: 'Husky',
      imageUrl: 'https://images.dog.ceo/breeds/husky/test.jpg',
    };
    const match: MatchResult = { pet, decision: 'like', timestamp: Date.now() };
    expect(match.decision).toBe('like');
    expect(match.timestamp).toBeGreaterThan(0);
    expect(match.pet.id).toBe(3);
  });
});
