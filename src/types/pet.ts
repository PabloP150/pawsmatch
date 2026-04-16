export interface Pet {
  id: number;
  name: string;
  bio: string;
  breed: string;
}

export interface PetWithImage extends Pet {
  imageUrl: string;
}

export type SwipeDecision = 'like' | 'pass';

export interface MatchResult {
  pet: PetWithImage;
  decision: SwipeDecision;
  timestamp: number;
}
