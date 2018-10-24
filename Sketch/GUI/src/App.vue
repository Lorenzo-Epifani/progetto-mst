<template>
  <div id="app">
    <respnav></respnav>
    <router-view></router-view>
 </div>
</template>

<script>
   import respnav from '@/components/nav.vue'
   import cardlist from '@/components/cardlist.vue'

export default {
  name: 'App',
  components :{respnav, cardlist},
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
