// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';

import login from '@/components/login/LoginCore.vue';
import profile from '@/components/profile/ProfileCore.vue';
import home from '@/components/home/HomeCore.vue';

Vue.use(Router);

export default new Router({
  mode: 'history', // Usare la modalità history per URL puliti
  routes: [
    {
      path: '/profile/:username', 
      name: 'profile',
      component: profile,
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/home',
      name: 'home',
      component: home,
    },
  ],
});