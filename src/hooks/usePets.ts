import { useState, useEffect, useRef, useCallback } from 'react';
import type { PetWithImage, MatchResult, SwipeDecision } from '../types/pet';
import { loadPet } from '../services/petProvider';
import { pets as allPets } from '../data/mockData';

const BUFFER_SIZE = 3;

export const usePets = () => {
  // Show first pet immediately from local data — no API wait on first render
  const [buffer, setBuffer] = useState<PetWithImage[]>(() =>
    allPets.slice(0, 1).map((p) => ({ ...p, imageUrl: '' }))
  );
  const [globalIndex, setGlobalIndex] = useState(1);
  const [swipedCount, setSwipedCount] = useState(0);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false); // prevents double-execution in StrictMode

  const isDone = swipedCount >= allPets.length;
  const totalPets = allPets.length;
  const currentPet = buffer[0] ?? null;

  const fillBuffer = useCallback(async (currentBuffer: PetWithImage[], startIndex: number) => {
    let buf = [...currentBuffer];
    let idx = startIndex;

    while (buf.length < BUFFER_SIZE && idx < allPets.length) {
      const fetchIdx = idx;
      idx += 1;
      try {
        const pet = await loadPet(fetchIdx);
        if (pet) buf = [...buf, pet];
      } catch {
        setError('No se pudo cargar la imagen. Intenta de nuevo.');
      }
    }

    setBuffer(buf);
    setGlobalIndex(idx);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    setIsLoading(true);
    // Load image for the first pet + fill the rest of the buffer
    fillBuffer([], 0).finally(() => setIsLoading(false));
  }, [fillBuffer]);

  const swipe = useCallback((decision: SwipeDecision) => {
    const pet = buffer[0];
    if (!pet) return;

    if (decision === 'like') {
      setMatches((prev) => [...prev, { pet, decision, timestamp: Date.now() }]);
    }

    const nextBuffer = buffer.slice(1);
    setBuffer(nextBuffer);
    setSwipedCount((c) => c + 1);

    // Refill tail in background — zero-latency swipe
    const nextIndex = globalIndex;
    if (nextIndex < allPets.length) {
      loadPet(nextIndex)
        .then((newPet) => {
          if (newPet) setBuffer((prev) => [...prev, newPet]);
          setGlobalIndex((i) => i + 1);
        })
        .catch(() => setError('No se pudo cargar la imagen. Intenta de nuevo.'));
    }
  }, [buffer, globalIndex]);

  const retry = useCallback(() => {
    setError(null);
    fillBuffer(buffer, globalIndex);
  }, [buffer, globalIndex, fillBuffer]);

  return { currentPet, buffer, swipedCount, totalPets, matches, isLoading, error, isDone, swipe, retry };
};
