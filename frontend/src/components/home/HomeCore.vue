<template>
  <div>
    <h1>HOME! IMPLEMENT THIS <br><br> NOW I USE THIS AS TODOLIST 
        <br><br> - ADD COMMENT AND LIKES TO COMMENTS
        <br><br> - I WOULD LIKE SEE WHO LIKED A PICTURE
        <br><br> - I WOULD LIKE SEE WHO LIKED A PICTURE
        <br><br> - PROFILE CAPTION AND IMAGE EDIT
    </h1>
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
