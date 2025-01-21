<template>
    <div class="instagram-post">
      <!-- Card Header with Username -->
      <md-card>
        <md-card-header>
          <div class="post-header">
            <img class="user-avatar" :src="this.userAvatar" alt="User Avatar" />
          </div>
        </md-card-header>
  
        <!-- Media Section -->
        <md-card-media>
          <img class="post-image" v-bind:src="this.image" alt="Post Image" />
        </md-card-media>
  
        <!-- Card Actions -->
        <md-card-media-actions>
          <div class="post-actions">
            <md-button class="md-icon-button">
              <md-icon>favorite</md-icon>
            </md-button>
            <likes>{{ cardLike }} people liked this.</likes>
          </div>
        </md-card-media-actions>
  
        <!-- Caption Section -->
        <div class="post-caption">
          <span class="username">{{ this.cardUser }}</span>
          <span class="caption-text">{{ this.caption }}</span>
        </div>
      </md-card>
    </div>
  </template>

<script>
  import * as api from '../api/queryfanart.js';
  export default 
  {
    name: 'CardComVue',

    data () 
    {
      return { image: this.carddataItem.image,
               cardUser: "USER",
               cardLike: null,
               caption: "CAPTION",
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
  
    }),         
api
        .getLikes(this.carddataItem.ID)
        .then(response => {
            this.cardLike =  Object.keys(response).length
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