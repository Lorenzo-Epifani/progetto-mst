<template>
      <div>
           
  <div v-for="item in carddata">
   <card v-bind:carddataItem="item"></card> 
  </div>

            
             
      </div>
</template>

<script>
  import * as api from '../api/queryfanart.js';
  import card from './card.vue';
  export default {
        name: 'cardlist',
        data () {
            return { carddata :null,
            }
        },
        components: {card
        },
        
         mounted () {
    api
      .getAllPhotos()
      .then(response => {
        this.carddata = response
      });
    
    }
  }
</script>


<style>

</style>