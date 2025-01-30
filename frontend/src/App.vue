<template>
    <div id="app">
        <respnav></respnav>
        <LoginOverlay :isOpen="showLoginOverlay" /> 
        <transition name="fade" mode="out-in">
            
            <router-view></router-view>
        </transition>
        
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
/* Effetto dissolvenza */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.35s ease-in-out;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in Vue 2 */ {
    opacity: 0;
}
</style>
