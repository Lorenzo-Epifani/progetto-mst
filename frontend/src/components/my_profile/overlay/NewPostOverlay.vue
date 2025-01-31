<template>
    <div v-if="isOpen" class="overlay">
        <div class="overlay-content">
            <div class="overlay-header">
                <h2>New Post</h2>
                <button class="close-button" @click="closeOverlay">✖</button>
            </div>
            
            <div class="overlay-body">
                <!-- Input per il link all'immagine -->
                <div class="input-group">
                    <label for="image-url">Image URL</label>
                    <input type="text" v-model="postData.img" id="image-url" placeholder="Image URL..." />
                </div>
                
                <!-- Anteprima dell'immagine -->
                <div class="image-preview">
                    <img 
                    :src="postData.img" 
                    alt="Image is not valid" 
                    @load="validateImage"
                    @error="invalidateImage"
                    v-show="isValid"
                    />
                    <p v-if="isValid===false" class="error-text">Image is not valid</p>
                </div>
                
                <!-- Input per la caption -->
                <div class="input-group">
                    <label for="caption">Caption</label>
                    <textarea v-model="postData.caption" id="caption" placeholder="Write a caption..." rows="3"></textarea>
                </div>
            </div>
            
            <!-- Bottone per pubblicare il post -->
            <div class="overlay-footer">
                <button @click="newPost">New post</button>
            </div>
        </div>
    </div>
</template>

<script>
import * as api from "@/api/my_profile.js";

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            isValid: null,
            postData: {
                img: "",
                caption: ""
            }
        };
    },
    methods: {
        invalidateImage() {
            this.isValid = false; // Se l'immagine non viene caricata, imposta isValid a false
        },
        validateImage() {
            this.isValid = true; // Se l'immagine non viene caricata, imposta isValid a false
        },
        async newPost() {
            if (this.isValid && this.postData.caption){
            await api.new_post(localStorage.getItem("sessionToken"),JSON.stringify(this.postData))
            this.postData.img = "";
            this.postData.caption = "";
            
            // Chiude l'overlay
            this.closeOverlay();
            }
        },
        closeOverlay() {
            this.$emit("close");

        }
    }
};
</script>

<style scoped>
/* 🔹 Stile Overlay (come Instagram) */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* 🔹 Contenitore principale */
.overlay-content {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    width: 400px;
    max-height: 90%;
    display: flex;
    flex-direction: column;
}

/* 🔹 Header */
.overlay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
}

.overlay-header h2 {
    font-size: 20px;
    font-weight: bold;
}

.close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #333;
}

/* 🔹 Input Style */
.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.input-group label {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
}

.input-group input,
.input-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
}

.input-group textarea {
    resize: none;
}

/* 🔹 Anteprima immagine */
.image-preview {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}

.image-preview img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* 🔹 Bottone di pubblicazione */
.overlay-footer {
    text-align: center;
}

.overlay-footer button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #0095F6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.overlay-footer button:hover {
    background-color: #0077cc;
}

.error-text {
    color: red;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
}
</style>
