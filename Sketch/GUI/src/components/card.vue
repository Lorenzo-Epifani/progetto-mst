<template>
 <div>
    <md-card>
      <md-card-media-actions>
        <md-card-media>
          <img v-bind:src="this.root" alt="cover"/>
        </md-card-media>

        <md-card-actions>
          <md-button class="md-icon-button">
            <md-icon>favorite</md-icon>
          </md-button>
           <likes>{{cardLike}} Peoples liked this.</likes>
        
        </md-card-actions>
      </md-card-media-actions>
       <md-card-header>
        <div class="md-title">{{cardUser}}</div>
        
       </md-card-header>
    </md-card>
  
  </div>
</template>

<script>
  import * as api from '../api/queryfanart.js';
  export default 
  {
    name: 'card',

    data () 
    {
      return { root: 'http://localhost:3000/porcoddio/'+this.carddataItem.ID,
               cardUser: null,
               cardLike: null
                }
    },
    components: 
    {
    },
    
  props: {
  carddataItem:{}
},
    
       mounted () {
api
        .getUserByID(this.carddataItem.Utente_ID)
        .then(response => {
            this.cardUser = response.nome
  
    })
         
api
        .getLikes(this.carddataItem.ID)
        .then(response => {
            this.cardLike =  Object.keys(response).length
            console.log(this.cardLike)

    })
  }
  }

</script>

<style>
  .md-card {
    width: 320px;
    margin: 4px;
  
  }
  
   div.md-card-actions.md-alignment-right div.md-ripple i.md-icon.md-icon-font.md-theme-default  {
     
   
   color: darkblue;
  }
  
  
  
div.md-card-actions.md-alignment-right div.md-ripple i.md-icon.md-icon-font.md-theme-default {
  
  animation: lds-heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}
div.md-card-actions.md-alignment-right div.md-ripple i.md-icon.md-icon-font.md-theme-default:after,

div.md-card-actions.md-alignment-right div.md-ripple i.md-icon.md-icon-font.md-theme-default:before {
  border-radius: 50% 0 0 50%;
}
div.md-card-actions.md-alignment-right div.md-ripple i.md-icon.md-icon-font.md-theme-default:after {
  border-radius: 50% 50% 0 0;
}
@keyframes lds-heart {
  0% {
    transform: scale(0.9);
  }
  5% {
    transform: scale(1.2);
  }
  39% {
    transform: scale(0.8);
  }
  45% {
    transform: scale(1);
  }
  60% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(0.85);
  }
}
  
 


</style>