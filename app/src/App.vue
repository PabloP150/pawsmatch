<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView v-slot="{ Component, route: r }">
    <Transition name="slide" mode="out-in">
      <component :is="Component" :key="r.path" />
    </Transition>
  </RouterView>
</template>
