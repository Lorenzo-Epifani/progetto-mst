<template>
  <div id="app">
    <respnav></respnav>
    <LoginOverlay :isOpen="showLoginOverlay" /> 
    <router-view></router-view>
 </div>
</template>

<script>
   import respnav from '@/components/shared/navbar/RespNavBar.vue'
   import LoginOverlay from '@/components/shared/LoginOverlay.vue'
   import { EventBus } from '@/eventBus';

   //import cardlist from '@/components/CardListCom.vue'

export default {
  name: 'App',
  components :{respnav, LoginOverlay},//, cardlist},
  data() {
    return {
      showLoginOverlay: false,
    };
  },
  created() {
    // Ascolta l'evento per aprire l'overlay
    EventBus.$on('openLoginOverlay', this.openLoginOverlay);
    EventBus.$on('closeLoginOverlay', this.closeLoginOverlay);
  },
  methods: {
    openLoginOverlay() {
      this.showLoginOverlay = true;
    },
    closeLoginOverlay() {
      this.showLoginOverlay = false;
    },
  },

}
 
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 
   
  text-align: left;
  color: #2c3e50;
}
</style>
