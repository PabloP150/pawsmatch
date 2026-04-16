export interface Pet {
  id: number;
  name: string;
  bio: string;
  breed: string;
}

export type SwipeDecision = 'like' | 'pass';

export interface MatchResult {
  pet: Pet;
  decision: SwipeDecision;
  timestamp: number;
}
