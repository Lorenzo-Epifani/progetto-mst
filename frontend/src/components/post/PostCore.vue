<template>
    <div v-if="logged" class="log-shield">

    <div class="post-container">
      <!-- Header del post: immagine profilo e nome utente -->
      <div class="post-header">
        <img :src="post_data.owner_img" alt="User Profile" class="profile-image" />
        <span class="owner_name">{{ post_data.owner_name }}</span>
      </div>
      
      <!-- Immagine del post -->
      <div class="post-image-container">
        <img :src="post_data.post_img" alt="Post Image" class="post-image" />
      </div>
      <div class="post-caption">{{ post_data.post_cpt }}</div>
      
      <!-- Azioni (like e commento) -->
      <div class="post-actions">
        <button @click="toggleLike" class="like-button">
          <span :class="{ 'liked': post_data.liked }">&#9829;</span>
        </button>
        <button @click="focusCommentInput" class="comment-button">💬</button>
      </div>
      
      <!-- Numero di like -->
      <div class="like-count">{{ post_data.likes_count }} Likes</div>
      
      <!-- Sezione Commenti -->
      <div class="comments-section">
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <span class="comment-user">{{ comment.user }}</span>: {{ comment.text }}
        </div>
        
        <!-- Input per nuovo commento -->
        <input v-model="newComment" ref="commentInput" class="comment-input" placeholder="Write comment..." @keyup.enter="submitComment" />
      </div>
    </div>
</div>
  </template>
  
  <script>
  import * as api from "@/api/post.js";
  
  export default {
    data() {
      return {
        logged: localStorage.getItem("sessionToken"),
        post_data: {},
        newComment: "",
        comments: []
      };
    },
    methods: {
      toggleLike() {
        this.post_data.liked = !this.post_data.liked;
        this.post_data.likes_count += this.post_data.liked ? 1 : -1;
        this.ClickLike();
      },
      focusCommentInput() {
        this.$refs.commentInput.focus();
      },
      submitComment() {
        if (this.newComment.trim()) {
          this.comments.push({ id: Date.now(), user: "Tu", text: this.newComment });
          this.newComment = "";
        }
      },
      ClickLike() {
        console.log("Like clicked!");
        //TODO, SCRIVI NELLA COLLECTION LIKE
      }
    },
    async created(){
      this.post_data = await api.init_post(localStorage.getItem("sessionToken"), this.$route.params.post_id);
      console.log(this.post_data);
    }
  };
  </script>
  
  <style scoped>
  .post-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }
  .post-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
  }
  .profile-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .owner_name {
    font-weight: bold;
    font-size: 18px;
  }
  .post-image-container {
    text-align: center;
    margin: 15px 0;
  }
  .post-image {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
  }
  .post-caption {
    padding: 10px;
    font-size: 16px;
    font-style: italic;
    text-align: center;
  }
  .post-actions {
    display: flex;
    gap: 15px;
    padding: 10px;
    align-items: center;
  }
  .like-button, .comment-button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .like-button span {
    color: black;
    transition: color 0.2s;
  }
  .like-button span.liked {
    color: red;
  }
  .like-button:active, .comment-button:active {
    transform: scale(1.1);
  }
  .like-count {
    font-weight: bold;
    padding: 5px 10px;
  }
  .comments-section {
    padding: 10px;
  }
  .comment {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .comment-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  </style>
