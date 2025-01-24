<template>
    <div class="profile-page">
      <!-- Header Profilo -->
      <div class="profile-header">
        <div class="profile-image">
          <img :src="this.profile_data.others_image" alt="Profile Image" />
        </div>
        <div class="profile-info">
          <h2>{{this.profile_data.others_name }}</h2>
          <p class="caption">{{ this.profile_data.others_caption }}</p>
          <div class="stats">
            <div class="stat-item">
              <strong>{{ this.profile_data.post_count }}</strong>
              <span>Post</span>
            </div>
            <div class="stat-item">
              <strong>{{ this.profile_data.followers }}</strong>
              <span>Followers</span>
            </div>
            <div class="stat-item">
              <strong>{{ this.profile_data.followed }}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Anteprima Post -->
      <div class="post-grid">
        <div v-for="(post, index) in this.profile_data.all_posts" :key="index" class="post-preview">
          <img :src="post.img" alt="Post Image" />
        </div>
      </div>
      <LoginOverlay :isOpen="showLoginOverlay" />
  
      <!-- Bottone per caricare altri post -->
        <div v-if="profile_data.post_cursor.next_token" class="load-more">
            <button @click="loadMorePosts">Load more</button>
        </div>
    </div>
  </template>
  
  <style scoped>
  .profile-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .profile-image img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
  }
  
  .profile-info h2 {
    margin: 0;
    font-size: 24px;
  }
  
  .profile-info .caption {
    margin-top: 5px;
    font-size: 14px;
    color: #555;
  }
  
  .stats {
    display: flex;
    gap: 20px;
    margin-top: 10px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-item strong {
    display: block;
    font-size: 18px;
  }
  
  .post-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 post per riga */
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .post-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .load-more {
    text-align: center;
    margin-top: 20px;
  }
  
  .load-more button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .load-more button:hover {
    background-color: #0056b3;
  }
  </style>
  
  <script>
  import * as api from "@/api/others_profile.js";
  import * as shared_api from "@/api/shared.js";
  import LoginOverlay from '@/components/others_profile/overlay/LoginOverlay.vue';

  export default {
    components: {
    LoginOverlay, // Registra il componente
  },
    data() {
      return {
        showLoginOverlay: false,
        profile_data:{
            all_posts:[],
            followers:null,
            followed:null,
            post_count:null,
            post_cursor:{
                post_list:[],
                next_token:null
            },
            others_image:null,
            others_name:this.$route.params.visited_username,
            others_caption:null,
        }
      };
    },
    methods:{
        async loadMorePosts(){
            const page_token = this.profile_data.post_cursor.next_token
            const sessionToken = localStorage.getItem("sessionToken") || null;
            const visited_user = this.$route.params.visited_username
            try{
                const more_posts = await api.more_posts(sessionToken, page_token, visited_user)
                this.profile_data.all_posts.push(...more_posts.data.post_list)
                this.profile_data.post_cursor.next_token = more_posts.data.next_token
            }catch(error){
                if (error.response.status===423)
            {
                this.showLoginOverlay = true; // Mostra l'overlay
            }
            }
        }
    },
    async created() {
    const sessionToken = localStorage.getItem("sessionToken");
    if(sessionToken){
    const whoami = await shared_api.whoami(sessionToken)
        if (whoami.data==this.profile_data.others_name){
        this.$router.push({ name: "my_profile" }); 
        }
    }
 

    // Token presente, procedi con il caricamento dei dati
    this.profile_data = await api.init_profile(sessionToken,this.$route.params.visited_username);
    this.profile_data["all_posts"]=this.profile_data.post_cursor.post_list
  },
  };
  </script>
  