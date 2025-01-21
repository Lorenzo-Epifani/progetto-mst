<template>
  <div>
    <h1>Profilo di: {{ username }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
    };
  },
  created() {
    // Accedi al parametro `username` dalla rotta
    this.username = this.$route.params.username;
  },
};
</script>
