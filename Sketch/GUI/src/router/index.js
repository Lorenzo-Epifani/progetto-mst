import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import cardlist from '@/components/cardlist'
import register from '@/components/register'
Vue.use(Router)

export default new Router({
  routes: [
   /* {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },*/
    
    {
      path: '/fanart',
      name: 'fanart',
      component: cardlist,
    },
    
     {
      path: '/register',
      name: 'register',
      component: register,
    },
  ]
})
