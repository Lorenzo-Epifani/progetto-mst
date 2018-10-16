<template> 
  <div id='navbar' class="md-elevation-14">
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
        name: 'navbar',
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
    background-color: mediumslateblue;  
    
      
  }
  .md-button-content {
    font-weight: bold;
    font font-size: 150%;
    color: white;
}


  
</style>