<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft, Heart, MapPin, Phone, Mail, Clock, CalendarCheck, ChevronRight
} from 'lucide-vue-next';
import type { PetWithImage } from '../types/pet';

const router = useRouter();

// Pet data is passed via router history state — no store required
const pet = computed<PetWithImage | null>(() => {
  try {
    return JSON.parse((history.state as { pet?: string }).pet ?? 'null') as PetWithImage;
  } catch {
    return null;
  }
});

// Mock shelter data — replace with real API when available
const shelter = {
  name: 'Refugio Patitas Felices',
  address: '6a Avenida 12-34, Zona 10, Ciudad de Guatemala',
  phone: '+502 2345-6789',
  email: 'adopciones@patitasfelices.gt',
  hours: [
    { day: 'Lunes a Viernes', time: '9:00 – 17:00' },
    { day: 'Sábado',          time: '9:00 – 14:00' },
    { day: 'Domingo',         time: 'Cerrado' },
  ],
  mapsUrl: 'https://maps.google.com/?q=Guatemala+City',
};

const keepBrowsing = () => router.push({ name: 'swipe' });

const scheduleVisit = () => {
  // Opens phone dialer; swap for a booking flow when available
  window.open(`tel:${shelter.phone.replace(/\s|-/g, '')}`);
};
</script>

<template>
  <div class="min-h-dvh flex flex-col">

    <!-- Top bar -->
    <header class="flex items-center gap-3 px-5 pt-safe-top pt-6 pb-4">
      <button
        class="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-sm hover:bg-white transition-colors active:scale-95"
        @click="keepBrowsing"
        aria-label="Volver"
      >
        <ArrowLeft :size="18" class="text-fur-800" />
      </button>
      <div>
        <h1 class="text-lg font-extrabold text-fur-900 leading-tight">¡Es un match!</h1>
        <p class="text-fur-400 text-xs">Detalles de adopción</p>
      </div>
      <Heart :size="20" class="ml-auto text-paws-500" fill="#f97316" />
    </header>

    <main class="flex-1 overflow-y-auto px-5 pb-8 space-y-4">

      <!-- Pet card -->
      <div v-if="pet" class="glass-card rounded-3xl overflow-hidden">
        <div class="relative h-56">
          <img :src="pet.imageUrl" :alt="pet.name" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div class="absolute bottom-4 left-4 text-white">
            <h2 class="text-2xl font-extrabold leading-tight">{{ pet.name }}</h2>
            <p class="text-white/80 text-sm">{{ pet.breed }}</p>
          </div>
        </div>
        <div class="px-5 py-4">
          <p class="text-fur-600 text-sm leading-relaxed whitespace-pre-line">{{ pet.bio }}</p>
        </div>
      </div>

      <!-- Shelter info -->
      <div class="glass-card rounded-3xl p-5 space-y-4">
        <h3 class="font-extrabold text-fur-900 text-base">{{ shelter.name }}</h3>

        <!-- Address -->
        <a
          :href="shelter.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-start gap-3 group"
        >
          <div class="flex-shrink-0 w-9 h-9 rounded-xl bg-paws-100 flex items-center justify-center">
            <MapPin :size="16" class="text-paws-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-fur-400 font-semibold uppercase tracking-wide mb-0.5">Dirección</p>
            <p class="text-fur-800 text-sm font-medium group-hover:text-paws-600 transition-colors">{{ shelter.address }}</p>
          </div>
          <ChevronRight :size="16" class="text-fur-300 flex-shrink-0 mt-2 group-hover:text-paws-500 transition-colors" />
        </a>

        <!-- Phone -->
        <a :href="`tel:${shelter.phone.replace(/\s|-/g, '')}`" class="flex items-start gap-3 group">
          <div class="flex-shrink-0 w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
            <Phone :size="16" class="text-green-600" />
          </div>
          <div class="flex-1">
            <p class="text-xs text-fur-400 font-semibold uppercase tracking-wide mb-0.5">Teléfono</p>
            <p class="text-fur-800 text-sm font-medium group-hover:text-green-600 transition-colors">{{ shelter.phone }}</p>
          </div>
          <ChevronRight :size="16" class="text-fur-300 flex-shrink-0 mt-2 group-hover:text-green-500 transition-colors" />
        </a>

        <!-- Email -->
        <a :href="`mailto:${shelter.email}`" class="flex items-start gap-3 group">
          <div class="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <Mail :size="16" class="text-blue-600" />
          </div>
          <div class="flex-1">
            <p class="text-xs text-fur-400 font-semibold uppercase tracking-wide mb-0.5">Correo electrónico</p>
            <p class="text-fur-800 text-sm font-medium group-hover:text-blue-600 transition-colors">{{ shelter.email }}</p>
          </div>
          <ChevronRight :size="16" class="text-fur-300 flex-shrink-0 mt-2 group-hover:text-blue-500 transition-colors" />
        </a>
      </div>

      <!-- Visiting hours -->
      <div class="glass-card rounded-3xl p-5">
        <div class="flex items-center gap-2 mb-4">
          <Clock :size="16" class="text-paws-500" />
          <h3 class="font-extrabold text-fur-900 text-base">Horarios de visita</h3>
        </div>
        <ul class="space-y-2">
          <li
            v-for="h in shelter.hours"
            :key="h.day"
            class="flex justify-between items-center text-sm"
          >
            <span class="text-fur-600 font-medium">{{ h.day }}</span>
            <span
              class="font-bold"
              :class="h.time === 'Cerrado' ? 'text-red-400' : 'text-fur-900'"
            >{{ h.time }}</span>
          </li>
        </ul>
      </div>

    </main>

    <!-- CTA footer -->
    <footer class="pb-safe-bottom pb-5 px-5 pt-3 space-y-3 bg-gradient-to-t from-fur-50/80 to-transparent backdrop-blur-sm">
      <button
        class="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-paws-500 to-snout-500 text-white font-extrabold text-base shadow-lg shadow-paws-200 hover:from-paws-600 hover:to-snout-600 active:scale-[0.98] transition-all duration-150"
        @click="scheduleVisit"
      >
        <CalendarCheck :size="20" />
        Agendar visita
      </button>
      <button
        class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-fur-200 text-fur-700 font-bold text-sm hover:bg-white active:scale-[0.98] transition-all duration-150"
        @click="keepBrowsing"
      >
        Seguir explorando
      </button>
    </footer>

  </div>
</template>
