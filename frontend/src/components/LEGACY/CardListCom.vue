<template>
      <div>
           
  <div v-for="item in carddata" :key="item.ID">
   <card v-bind:carddataItem="item"></card> 
  </div>

            
             
      </div>
</template>

<script>
  import * as api from '../api/queryfanart.js';
  import card from './CardCom.vue';
  export default {
        name: 'CardListCom',
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
      })
       .catch(() =>{
        this.carddata = ["EMPTY"]
       });
    
    }
  }
</script>


<style>

</style>