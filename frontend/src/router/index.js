// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';

import login from '@/components/login/LoginCore.vue';
import my_profile from '@/components/my_profile/MyProfileCore.vue';
import others_profile from '@/components/others_profile/OthersProfileCore.vue';
import home from '@/components/home/HomeCore.vue';

Vue.use(Router);

export default new Router({
    mode: 'history', // Usare la modalità history per URL puliti
    routes: [
        {
            path: '/profile/', 
            name: 'my_profile',
            component: my_profile,
            beforeEnter: (to, from, next) => {
                const sessionToken = localStorage.getItem('sessionToken');
                if (!sessionToken) {
                    // Se c'è un token, reindirizza a /profile
                    next('/login');
                } else {
                    // Altrimenti resta su /login
                    next();
                }
            }
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            beforeEnter: (to, from, next) => {
                const sessionToken = localStorage.getItem('sessionToken');
                if (sessionToken) {
                    // Se c'è un token, reindirizza a /profile
                    next('/profile');
                } else {
                    // Altrimenti resta su /login
                    next();
                }
            }
        },
        {
            path: '/profile/:visited_username', 
            name: 'others_profile',
            component: others_profile,
        },
        {
            path: '/home',
            name: 'home',
            component: home,
        },
    ],
});