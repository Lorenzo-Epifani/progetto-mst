<template>
  <div>
    <h1>Profilo di: {{ username }}</h1>
  </div>
</template>

<script>
import * as api  from '@/api/profile.js';

export default {
  data() {
    return {
      username: '',
      follower_count:0,
      followed_count:0,
      my_image:null,
      myposts:[],
    };
  },
  created() {
    // Accedi al parametro `username` dalla rotta
    this.username = api.from_token(localStorage.getItem("sessionToken"))
  },
};
</script>
