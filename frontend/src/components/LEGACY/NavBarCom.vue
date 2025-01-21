<template> 
  <div id='navbar' class="md-elevation-14 ">
    <md-tabs class="md-accent" md-alignment="right">
      <md-tab id="tab-home" md-label="Fanart" md-icon="dashboard"  ></md-tab>
      <md-tab id="tab-pages" md-label="Profilo" md-icon="accessibility"></md-tab>
      <md-tab id="tab-posts" md-label="Prodotti" md-icon="attach_money"></md-tab>
      <md-tab id="tab-favorites" md-label="Preferiti" md-icon="favorite"></md-tab>
      <md-button class="md-primary">Primary</md-button>
    </md-tabs>
    
   
      </div>
</template>

<script>
    export default {
        name: 'NavBarCom',
        data () {
            return {
            }
        },
        components: {
        }
    }
</script>

<style>
     .md-tabs {
    margin-top: 8px;
    background-color: darkblue;  
    
      
  }
  div#navbar .md-button-content {
    font-weight: bold;
    font-size: 150%;
    color: white;

}
  div#navbar .md-button-content:hover{
        animation: lds-beat 0.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;

  }
 
 /* .lds-circle {
  display: inline-block;
  width: 51px;
  height: 51px;
  margin: 6px;
  border-radius: 50%;
  background: #fff;
  animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
} */
@keyframes lds-circle{
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}

@keyframes lds-beat {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  40% {
    transform: scale(0.97);
    opacity: 0.7;
  }
  80% {
    transform: scale(1.03);
    opacity: 1;
  }
}

@keyframes shake {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  10% {
    transform: translate(-5px, 5px) rotate(-5deg) scale(1.05);
  }
  20% {
    transform: translate(5px, -5px) rotate(5deg) scale(0.95);
  }
  30% {
    transform: translate(-5px, -5px) rotate(-3deg) scale(1.1);
  }
  40% {
    transform: translate(5px, 5px) rotate(3deg) scale(0.9);
  }
  50% {
    transform: translate(-5px, 0) rotate(0deg) scale(1.05);
  }
  60% {
    transform: translate(5px, -5px) rotate(-5deg) scale(0.95);
  }
  70% {
    transform: translate(-5px, 5px) rotate(5deg) scale(1.1);
  }
  80% {
    transform: translate(5px, -5px) rotate(-3deg) scale(0.9);
  }
  90% {
    transform: translate(-5px, 0) rotate(0deg) scale(1.05);
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
}

  
</style>



