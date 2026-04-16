<script setup lang="ts">
import { ref, computed } from 'vue';
import { Heart, X, MapPin, Tag } from 'lucide-vue-next';
import type { PetWithImage } from '../types/pet';

const props = defineProps<{ pet: PetWithImage }>();
const emit = defineEmits<{
  like: [];
  pass: [];
}>();

// Drag-to-swipe state
const isDragging = ref(false);
const dragX = ref(0);
const dragY = ref(0);
const startX = ref(0);
const startY = ref(0);
const isLeaving = ref<'like' | 'pass' | null>(null);

const SWIPE_THRESHOLD = 90;

const cardStyle = computed(() => {
  if (isLeaving.value) return {};
  if (!isDragging.value) return {};
  const rotate = (dragX.value / 20).toFixed(2);
  return {
    transform: `translate(${dragX.value}px, ${dragY.value * 0.3}px) rotate(${rotate}deg)`,
    transition: 'none',
    cursor: 'grabbing',
  };
});

const likeOpacity = computed(() => Math.min(Math.max(dragX.value / SWIPE_THRESHOLD, 0), 1));
const passOpacity = computed(() => Math.min(Math.max(-dragX.value / SWIPE_THRESHOLD, 0), 1));

// ── Pointer / touch handlers ────────────────────────────────
const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return;
  dragX.value = e.clientX - startX.value;
  dragY.value = e.clientY - startY.value;
};

const onPointerUp = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  if (dragX.value > SWIPE_THRESHOLD) {
    triggerSwipe('like');
  } else if (dragX.value < -SWIPE_THRESHOLD) {
    triggerSwipe('pass');
  } else {
    // snap back
    dragX.value = 0;
    dragY.value = 0;
  }
};

const triggerSwipe = (direction: 'like' | 'pass') => {
  isLeaving.value = direction;
  dragX.value = 0;
  dragY.value = 0;
  setTimeout(() => {
    isLeaving.value = null;
    if (direction === 'like') emit('like');
    else emit('pass');
  }, 280);
};
</script>

<template>
  <div
    class="relative w-full max-w-sm mx-auto select-none"
    :class="{
      'card-leave-to-like': isLeaving === 'like',
      'card-leave-to-pass': isLeaving === 'pass',
    }"
    :style="cardStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- Swipe hint labels -->
    <div
      class="absolute top-8 left-6 z-20 swipe-label-pass px-3 py-1 rounded-lg font-black text-xl uppercase tracking-widest pointer-events-none"
      :style="{ opacity: passOpacity }"
    >
      Pasar
    </div>
    <div
      class="absolute top-8 right-6 z-20 swipe-label-like px-3 py-1 rounded-lg font-black text-xl uppercase tracking-widest pointer-events-none"
      :style="{ opacity: likeOpacity }"
    >
      ¡Me gusta!
    </div>

    <!-- Card -->
    <div class="glass-card rounded-[2rem] overflow-hidden">

      <!-- Photo -->
      <div class="relative h-80 overflow-hidden bg-gradient-to-br from-paws-100 to-fur-200">
        <img
          :src="pet.imageUrl"
          :alt="pet.name"
          class="w-full h-full object-cover"
          draggable="false"
        />
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <!-- Breed badge -->
        <div class="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-fur-800 text-xs font-bold px-3 py-1.5 rounded-full">
          <Tag :size="11" />
          {{ pet.breed }}
        </div>
      </div>

      <!-- Info -->
      <div class="px-6 pt-5 pb-4">
        <h2 class="text-2xl font-extrabold text-fur-900 mb-1 leading-tight">{{ pet.name }}</h2>
        <div class="flex items-center gap-1.5 text-fur-400 text-xs mb-3">
          <MapPin :size="12" />
          <span>Guatemala, GT</span>
        </div>
        <p class="text-fur-600 text-sm leading-relaxed whitespace-pre-line line-clamp-3">{{ pet.bio }}</p>
      </div>

      <!-- Action bar -->
      <div class="glass-action-bar flex gap-4 px-6 py-4">
        <button
          class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 bg-red-50/60 hover:bg-red-100 active:scale-95 text-red-500 font-bold text-sm transition-all duration-150"
          @click.stop="triggerSwipe('pass')"
        >
          <X :size="18" stroke-width="3" />
          Pasar
        </button>
        <button
          class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-paws-500 to-snout-500 hover:from-paws-600 hover:to-snout-600 active:scale-95 text-white font-bold text-sm shadow-lg shadow-paws-200 transition-all duration-150"
          @click.stop="triggerSwipe('like')"
        >
          <Heart :size="18" stroke-width="2.5" fill="white" />
          Adoptar
        </button>
      </div>
    </div>
  </div>
</template>
