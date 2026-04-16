import { createRouter, createWebHistory } from 'vue-router';
import SwipeView from '../views/SwipeView.vue';
import AdoptionDetails from '../views/AdoptionDetails.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'swipe',
      component: SwipeView,
    },
    {
      path: '/adoptar/:id',
      name: 'adoption',
      component: AdoptionDetails,
    },
  ],
});

export default router;
