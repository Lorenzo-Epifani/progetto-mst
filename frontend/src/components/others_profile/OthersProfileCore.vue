<template>
    <div class="profile-page">
        <!-- Header Profilo -->
        <div class="profile-header">
            <div class="profile-image">
                <img :src="this.profile_data.others_image" alt="Profile Image" />
            </div>
            <div class="profile-info">
                <div class="name-follow">
                    <h2>{{ this.others_name }}</h2>
                    <button
                    v-if="logged"
                    class="follow-button"
                    :class="{ 'is-followed': isFollowed }"
                    @click="clickFollow"
                    >
                    {{ isFollowed ? 'Unfollow' : 'Follow' }}
                </button>
            </div>
            <p class="caption">{{ this.profile_data.others_caption }}</p>
            <div class="stats">
                <div class="stat-item">
                    <strong>{{ this.profile_data.post_count }}</strong>
                    <span>Post</span>
                </div>
                <div class="stat-item" @click="openOverlay('followers')"> 
                    <strong>{{ this.profile_data.followers }}</strong>
                    <span>Followers</span>
                </div>
                <div class="stat-item" @click="openOverlay('following')"> 
                    <strong>{{ this.profile_data.followed }}</strong>
                    <span>Following</span>
                </div>
            </div>
        </div>
    </div>
    <!-- Overlay -->
    
    <!-- Anteprima Post -->
    <div class="post-grid">
        <div v-for="(post, index) in this.profile_data.all_posts" :key="index" class="post-preview">
            <img :src="post.img" alt="Post Image" />
        </div>
    </div>
    <!--  <LoginOverlay :isOpen="showLoginOverlay" /> OLD -->
    <FollowOverlay v-if="showFollowOverlay"  :isOpen="showFollowOverlay" :type="overlayType" @close="closeOverlay" :username="others_name"/>
    
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

.name-follow {
    display: flex;
    align-items: center;
    gap: 10px;
}

.follow-button {
    padding: 5px 15px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.follow-button:hover {
    background-color: #0056b3;
}

.follow-button.is-followed {
    background-color: #f9f9f9;
    color: black;
    border: 1px solid #ddd;
}

.follow-button.is-followed:hover {
    background-color: #e0e0e0;
}
</style>

<script>
import * as api from "@/api/others_profile.js";
import * as shared_api from "@/api/shared.js";
//import LoginOverlay from '@/components/others_profile/overlay/LoginOverlay.vue';
import FollowOverlay from "@/components/others_profile/overlay/FollowOverlay.vue";

export default {
    components: {
        //LoginOverlay, // Registra il componente
        FollowOverlay // Registra il componente per l'overlay
    },
    data() {
        return {
            showFollowOverlay:false,
            isFollowed:false,
            othersExists:true,
            whoami: null,
            overlayType: null, // Tipo di overlay: "followers" o "followed"
            others_name:this.$route.params.visited_username,
            logged:false,
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
                others_caption:null,
            }
        };
    },
    methods:{
        async loadMorePosts(){
            const page_token = this.profile_data.post_cursor.next_token
            const sessionToken = localStorage.getItem("sessionToken") || null;
            const visited_user = this.$route.params.visited_username
            const more_posts = await api.more_posts(sessionToken, page_token, visited_user)
            this.profile_data.all_posts.push(...more_posts.data.post_list)
            this.profile_data.post_cursor.next_token = more_posts.data.next_token
            
        },
        async clickFollow(){
            const token = localStorage.getItem("sessionToken")
            const response = await api.follow_unfollow(token,this.whoami,this.others_name)
            
            switch (response) {
                case "REMOVED":
                this.profile_data.followers--
                break;
                case "ADDED":
                this.profile_data.followers++
                break
            }
            this.isFollowed=!this.isFollowed
            
        },
        openOverlay(type) {
            this.overlayType = type; // "followers" o "followed"
            this.showFollowOverlay = true;
        },
        closeOverlay() {
            this.showFollowOverlay = false;
            this.overlayType = null;
        },
    },
    async created() {
        this.exist = api.exist(this.others_name) //CHECK IF USER EXIST
        const sessionToken = localStorage.getItem("sessionToken");
        if(sessionToken){// OPERATION TO DO ONLY IF LOGGED
            this.whoami = (await shared_api.whoami(sessionToken)).data
            if (this.whoami==this.others_name){
                this.$router.push({ name: "my_profile" }); 
            }
            this.logged=true
            this.isFollowed = await api.follow_check(sessionToken,this.whoami,this.others_name)
            
        }
        
        // Token presente, procedi con il caricamento dei dati
        this.profile_data = await api.init_profile(sessionToken,this.$route.params.visited_username);
        this.profile_data["all_posts"]=this.profile_data.post_cursor.post_list
    },
};
</script>
