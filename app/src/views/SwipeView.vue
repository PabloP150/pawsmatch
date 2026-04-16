<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Heart, RefreshCw, AlertCircle } from 'lucide-vue-next';
import PetCard from '../components/PetCard.vue';
import { usePets } from '../hooks/usePets';

const router = useRouter();
const { currentPet, swipedCount, totalPets, matches, isLoading, error, isDone, swipe, retry } = usePets();

const leavingDirection = ref<'like' | 'pass' | null>(null);

const handleSwipe = async (decision: 'like' | 'pass') => {
  leavingDirection.value = decision;
  const pet = currentPet.value;

  await swipe(decision);
  leavingDirection.value = null;

  if (decision === 'like' && pet) {
    router.push({
      name: 'adoption',
      params: { id: pet.id },
      state: { pet: JSON.stringify(pet) },
    });
  }
};

const progressPercent = computed(() =>
  totalPets.value ? Math.round((swipedCount.value / totalPets.value) * 100) : 0
);
</script>

<template>
  <div class="min-h-dvh flex flex-col">

    <!-- Header -->
    <header class="flex items-center justify-between px-5 pt-safe-top pt-6 pb-3">
      <div>
        <h1 class="text-2xl font-black text-fur-900 tracking-tight leading-none">🐾 PawsMatch</h1>
        <p class="text-fur-400 text-xs mt-0.5">Encuentra a tu compañero ideal</p>
      </div>
      <div class="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
        <Heart :size="14" class="text-paws-500" fill="#f97316" />
        <span class="text-fur-800 font-bold text-sm">{{ matches.length }}</span>
      </div>
    </header>

    <!-- Progress bar -->
    <div class="px-5 mb-4">
      <div class="h-1 w-full bg-fur-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-paws-400 to-snout-400 rounded-full transition-all duration-500"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
      <p class="text-fur-400 text-xs mt-1 text-right">{{ swipedCount }} / {{ totalPets }} vistos</p>
    </div>

    <!-- Main content area -->
    <main class="flex-1 flex flex-col items-center justify-center px-5 pb-8">

      <!-- Loading state -->
      <div v-if="isLoading" class="flex flex-col items-center gap-4">
        <span class="text-5xl paw-pulse">🐾</span>
        <p class="text-fur-500 font-semibold text-sm">Buscando mascotas...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
        <AlertCircle :size="40" class="text-red-400 mx-auto mb-3" />
        <p class="text-fur-800 font-bold mb-1">Algo salió mal</p>
        <p class="text-fur-500 text-sm mb-5">{{ error }}</p>
        <button
          class="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-paws-500 text-white font-bold text-sm hover:bg-paws-600 transition-colors active:scale-95"
          @click="retry"
        >
          <RefreshCw :size="15" />
          Intentar de nuevo
        </button>
      </div>

      <!-- Done state -->
      <div v-else-if="isDone" class="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
        <p class="text-6xl mb-4">🎉</p>
        <h2 class="text-xl font-extrabold text-fur-900 mb-2">¡Ya los viste todos!</h2>
        <p class="text-fur-500 text-sm mb-1">Diste me gusta a</p>
        <p class="text-4xl font-black text-paws-500 mb-4">{{ matches.length }}</p>
        <p class="text-fur-500 text-sm">{{ matches.length === 1 ? 'perrito' : 'perritos' }} esperan conocerte.</p>
      </div>

      <!-- Card deck -->
      <template v-else-if="currentPet">
        <!-- Background stacked cards -->
        <div class="relative w-full max-w-sm mx-auto">
          <div
            v-for="(_, i) in [1, 2]"
            :key="i"
            class="absolute inset-0 glass-card rounded-[2rem]"
            :style="{
              transform: `scale(${1 - (i + 1) * 0.04}) translateY(${(i + 1) * 10}px)`,
              zIndex: -i - 1,
              opacity: 1 - (i + 1) * 0.15,
            }"
          />

          <!-- Active card with transition -->
          <Transition
            mode="out-in"
            :enter-from-class="'card-enter-from'"
            enter-active-class="card-enter-active"
          >
            <PetCard
              :key="currentPet.id"
              :pet="currentPet"
              @like="handleSwipe('like')"
              @pass="handleSwipe('pass')"
            />
          </Transition>
        </div>
      </template>

    </main>

    <!-- Swipe hint -->
    <footer v-if="!isLoading && !isDone && !error && currentPet" class="pb-safe-bottom pb-4 text-center">
      <p class="text-fur-300 text-xs">Arrastra la tarjeta o usa los botones</p>
    </footer>

  </div>
</template>
