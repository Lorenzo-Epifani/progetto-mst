<template>
  <div>
    <form action="http://localhost:3000/auth/register" method="post" >

       <md-field>
      <label>Username</label>
      <md-input v-model="Username" name="Username"></md-input>
      <span class="md-helper-text">Helper text</span>
    </md-field>
      
      <md-field>
      <label>Password</label>
      <md-input v-model="Password" name="Password"></md-input>
      <span class="md-helper-text">Helper text</span>
    </md-field>

    <button type="submit">submit</button>
</form>
    </div>
</template>

<script>
  export default {
    name: 'RegisterCom',
    data: () => ({
      type1: null,
      type2: null,

    
  
    })
  }
</script>