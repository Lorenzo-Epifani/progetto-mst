<template>
<div>
<navbar></navbar>
<mobilenav></mobilenav>
</div>
</template>

<script>
    import mobilenav from './MobNavBarCom.vue';
    import navbar from './NavBarCom.vue';
    export default {
        name: 'NavCom',
        data () {
            return {
            }
        },
        components: {navbar, mobilenav
        },
    }


</script>


<style>
    @media only screen and (max-width: 600px) {
    .md-tabs-navigation.md-elevation-0 {
        height: 0px;
        width:0px;
    }
}
    
        @media not screen and (max-width: 600px) {
    .bm-burger-button {
        height: 0px;
        width:0px;
          background-color: darkblue;
        
    }
            
            div.burg {
        height: 0px;
        width:0px;
        background-color: darkblue;
        
    } 
            
            #app > div:nth-child(1) {
                 height: 72px;
        
            }
}
    
    

</style>