import { ref, computed, onMounted } from 'vue';
import type { PetWithImage, MatchResult, SwipeDecision } from '../types/pet';
import { loadPet } from '../services/petProvider';
import { pets as allPets } from '../data/mockData';

const BUFFER_SIZE = 3;

export const usePets = () => {
  const buffer = ref<PetWithImage[]>([]);
  const globalIndex = ref(0);   // next index to fetch from the full deck
  const swipedCount = ref(0);   // cards the user has already seen
  const matches = ref<MatchResult[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const initialized = ref(false); // guard: prevents double-execution on hot reload

  const currentPet = computed<PetWithImage | null>(() => buffer.value[0] ?? null);
  const isDone = computed(() => swipedCount.value >= allPets.length);
  const totalPets = computed(() => allPets.length);

  /** Fills the buffer up to BUFFER_SIZE, fetching from the API tail. */
  const fillBuffer = async () => {
    while (buffer.value.length < BUFFER_SIZE && globalIndex.value < allPets.length) {
      const idx = globalIndex.value;
      globalIndex.value += 1;
      try {
        const pet = await loadPet(idx);
        if (pet) buffer.value.push(pet);
      } catch (e) {
        error.value = 'No se pudo cargar la imagen. Intenta de nuevo.';
      }
    }
  };

  const swipe = async (decision: SwipeDecision) => {
    const pet = currentPet.value;
    if (!pet) return;

    if (decision === 'like') {
      matches.value.push({ pet, decision, timestamp: Date.now() });
    }

    // Remove head of buffer, then refill tail in background
    buffer.value.shift();
    swipedCount.value += 1;
    fillBuffer(); // intentionally not awaited — zero-latency swipe
  };

  const retry = async () => {
    error.value = null;
    await fillBuffer();
  };

  onMounted(async () => {
    if (initialized.value) return; // StrictMode-style guard
    initialized.value = true;
    isLoading.value = true;
    await fillBuffer();
    isLoading.value = false;
  });

  return { buffer, currentPet, swipedCount, totalPets, matches, isLoading, error, isDone, swipe, retry };
};
