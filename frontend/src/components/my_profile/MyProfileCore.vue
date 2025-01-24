<template>
    <div class="my_profile-page">
        <!-- Header Profilo -->
        <div class="my_profile-header">
            <div class="my_profile-image">
                <img :src="this.my_profile_data.my_image" alt="my_Profile Image" />
            </div>
            <div class="my_profile-info">
                <h2>{{this.my_profile_data.my_name }}</h2>
                <p class="caption">{{ this.my_profile_data.my_caption }}</p>
                <div class="stats">
                    <div class="stat-item">
                        <strong>{{ this.my_profile_data.post_count }}</strong>
                        <span>Post</span>
                    </div>
                    <div class="stat-item">
                        <strong>{{ this.my_profile_data.followers }}</strong>
                        <span>Followers</span>
                    </div>
                    <div class="stat-item">
                        <strong>{{ this.my_profile_data.followed }}</strong>
                        <span>Following</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Anteprima Post -->
        <div class="post-grid">
            <div v-for="(post, index) in this.my_profile_data.all_posts" :key="index" class="post-preview">
                <img :src="post.img" alt="Post Image" />
            </div>
        </div>
        
        <!-- Bottone per caricare altri post -->
        <div v-if="my_profile_data.post_cursor.next_token" class="load-more">
            <button @click="loadMorePosts">Load more</button>
        </div>
    </div>
</template>

<style scoped>
.my_profile-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.my_profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.my_profile-image img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
}

.my_profile-info h2 {
    margin: 0;
    font-size: 24px;
}

.my_profile-info .caption {
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
import * as api from "@/api/my_profile.js";

export default {
    data() {
        return {
            my_profile_data:{
                all_posts:[],
                followers:null,
                followed:null,
                post_count:null,
                post_cursor:{
                    post_list:[],
                    next_token:null
                },
                my_image:null,
                my_name:null,
                my_caption:null,
            }
        };
    },
    methods:{
        async loadMorePosts(){
            const page_token = this.my_profile_data.post_cursor.next_token
            const more_posts = await api.more_posts(localStorage.getItem("sessionToken"), page_token)
            //console.log(more_posts)
            this.my_profile_data.all_posts.push(...more_posts.data.post_list)
            this.my_profile_data.post_cursor.next_token = more_posts.data.next_token
        }
    },
    async created() {
        const sessionToken = localStorage.getItem("sessionToken");
        
        if (!sessionToken) {
            // Token non trovato, reindirizza a login
            this.$router.push({ name: "login" }); // Assicurati che la rotta di login abbia il nome "login"
            return;
        }
        
        // Token presente, procedi con il caricamento dei dati
        this.my_profile_data = await api.init_me(sessionToken);
        this.my_profile_data["all_posts"]=this.my_profile_data.post_cursor.post_list
    },
};
</script>
