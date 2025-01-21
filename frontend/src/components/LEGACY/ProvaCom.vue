<template>

<div id="prova1">
  {{ message }}
</div>
</template>



<script>
export default {
  name: 'prova',
  data () {
    return {message: 'prova'}
  },
  /*computed: {},
  methods: {
    onSubmit: async function (evt) {
      evt.preventDefault()
      await this.createDevice(this.form)
    },
    ...mapActions(['createDevice', 'getAllDevices'])
  },
 created: function () {} 
  }*/
}
  </script>
  
<style>
</style>