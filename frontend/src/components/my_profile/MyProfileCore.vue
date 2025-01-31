<template>
    <div class="my_profile-page">
        <!-- Header Profilo -->
        <div class="my_profile-header">
            <div class="my_profile-image">
                <img :src="this.my_profile_data.my_image" alt="my_Profile Image" />
            </div>
            <div class="my_profile-info">
                <h2>{{this.my_profile_data.my_name }}</h2>
                <div class="caption-container">
                    
                    <p class="caption">{{ this.my_profile_data.my_caption }}</p>
                </div>
                <div class="stats">
                    <div class="stat-item">
                        <strong>{{ this.my_profile_data.post_count }}</strong>
                        <span>Post</span>
                    </div>
                    <div class="stat-item" @click="openOverlay('followers')"> 
                        <strong>{{ this.my_profile_data.followers }}</strong>
                        <span>Followers</span>
                    </div>
                    <div class="stat-item" @click="openOverlay('following')"> 
                        <strong>{{ this.my_profile_data.followed }}</strong>
                        <span>Following</span>
                    </div>
                </div>
            </div>
            <md-button
            class="md-icon-button"
            @click="newPost"
            md-icon="photo_camera"
            >
            <md-icon>photo_camera</md-icon>
        </md-button>
    </div>
    
    <!-- Anteprima Post -->
    <div class="post-grid">
        <div v-for="(post, index) in this.my_profile_data.all_posts" :key="index" class="post-preview" @click="redirectToPost(post._id)">
            <img :src="post.img" alt="Post Image" />
        </div>
    </div>
    <FollowOverlay v-if="showFollowOverlay"  :isOpen="showFollowOverlay" :type="overlayType" @close="closeFollowerOverlay" :username="my_profile_data.my_name"/>
    <NewPostOverlay v-if="showNewPostOverlay"  :isOpen="showNewPostOverlay" @close="closeNewPostOverlay"/>
    
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

.post-preview {
    position: relative;
    width: 100%; /* Occupa tutto lo spazio disponibile nella griglia */
    aspect-ratio: 1 / 1; /* Forza un rapporto di aspetto 1:1 (quadrato) */
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.post-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Assicura che l'immagine riempia il contenitore senza deformarsi */
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
.post-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}


.post-preview:hover {
    transform: scale(1.05);
}

.post-preview::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 255, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: scale(1);
}

.post-preview:hover::after {
    opacity: 1;
    transform: scale(1.1);
}

.post-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.caption-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.md-icon-button {
    
    scale: 2.6;
    margin: auto ;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.md-icon-button:hover {
    transform: scale(1.1);
}


</style>

<script>
import * as api from "@/api/my_profile.js";
import FollowOverlay from "@/components/my_profile/overlay/FollowOverlay.vue";
import NewPostOverlay from "@/components/my_profile/overlay/NewPostOverlay.vue";

export default {
    components: {
        FollowOverlay,
        NewPostOverlay
    },
    data() {
        return {
            showFollowOverlay:false,
            showNewPostOverlay:false,
            overlayType: null, // Tipo di overlay: "followers" o "followed"
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
        newPost(){
            this.showNewPostOverlay = true;
        },
        redirectToPost(postId) {
            return this.$router.push({ path: `/post/${postId}` });
        },
        async loadMorePosts(){
            const page_token = this.my_profile_data.post_cursor.next_token
            const more_posts = await api.more_posts(localStorage.getItem("sessionToken"), page_token)
            //console.log(more_posts)
            this.my_profile_data.all_posts.push(...more_posts.data.post_list)
            this.my_profile_data.post_cursor.next_token = more_posts.data.next_token
        },
        openOverlay(type) {
            this.overlayType = type; // "followers" o "followed"
            this.showFollowOverlay = true;
        },
        closeFollowerOverlay() {
            this.showFollowOverlay = false;
            this.overlayType = null;
        },
        closeNewPostOverlay() {
            this.showNewPostOverlay = false;
            this.overlayType = null;
            this.refreshProfileData(); // Forza l'aggiornamento del componente

        },
        async refreshProfileData() {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
        this.my_profile_data = await api.init_me(sessionToken);
        this.my_profile_data["all_posts"] = this.my_profile_data.post_cursor.post_list;
    }
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
