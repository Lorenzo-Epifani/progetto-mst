// src/main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(VueMaterial);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwtToken');
    if(token){
        console.log("LOGGED")
    }else{
        console.log("NOT_LOGGED")
    }
    next()
})
new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
});
