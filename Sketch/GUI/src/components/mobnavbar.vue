<template>
<div class="burg " >
    <Slide>
     <md-button class="md-primary">MENU PRINCIPALE</md-button>
      <md-button class="md-primary">Primary</md-button>
      <md-button class="md-primary">Primary</md-button>
      <md-button class="md-primary">Primary</md-button>
            <md-button class="md-primary">Primary</md-button>

    </Slide>
  </div>
</template>


<style>
  div.burg {
    height: 100px;
    background-color: darkblue
  }
  nav .md-button {
    width: 100%;
   
  }
  
  nav .md-button-content {
    position: relative;
    top: 0px;
    right: 25%;
    color: white;
    font-weight: bold
  }
  nav.bm-item-list {
    margin: unset;
        background-color: #3366ff

  }
  
  #sideNav > nav > button:nth-child(1) {
    margin:unset
  }
  
  div#sideNav {
        background-color:  darkblue;
    }
  
  span.bm-burger-bars.line-style {
    background-color: white;
  }
  
</style>

<script>
  import { Slide } from 'vue-burger-menu'  // import the CSS transitions you wish to use, in this case we are using `Slide`

export default {
   components: {
        Slide // Register your component
    },
  name: 'mobnavbar',
  
}
</script>