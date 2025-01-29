<template>
    <div v-if="isOpen" class="overlay">
        <div class="overlay-content">
            <div class="overlay-header">
                <h2>{{ overlayTitle }}</h2>
                <button class="close-button" @click="closeOverlay">✖</button>
            </div>
            <div class="overlay-body">
                <div
                v-for="(entry, index) in entries"
                :key="index"
                class="entry-item"
                @click="visitProfile(entry.user_details.username)"
                >
                <img :src="entry.user_details.img" alt="Profile Image" class="entry-img" />
                <span>{{ entry.user_details.username }}</span>
            </div>
        </div>
        <div class="overlay-footer">
            <button v-if="nextPageToken" @click="loadMoreEntries">Load More</button>
        </div>
    </div>
</div>
</template>

<script>
import * as api from "@/api/shared.js";

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: true, // "followers" o "followed"
        },
        username: {
            type: String,
            required: true, // "followers" o "followed"
        },
    },
    data() {
        return {
            entries: [], // Lista caricata dall'API
            nextPageToken: null, // Token per la paginazione
        };
    },
    computed: {
        overlayTitle() {
            return this.type === "followers" ? "Followers" : "Following";
        },
    },
    methods: {
        async loadEntries(next_token=null) {
            const response = await api.load_follow(localStorage.getItem("sessionToken"), next_token, this.username, this.type);
            this.entries.push(...response.data.profiles);
            
            this.nextPageToken = response.data.next_token; // Aggiorna il token per la paginazione
            this.has_more = response.data.has_more; // Aggiorna il token per la paginazione
            
        },
        async loadMoreEntries() {
            try{
                await this.loadEntries(this.nextPageToken); // Carica altre entries
            } catch(error){
                this.$emit("close"); 
                throw error
            }
        },
        closeOverlay() {
            this.$emit("close"); // Comunica al componente genitore di chiudere l'overlay
        },
        visitProfile(username) {
            this.closeOverlay(); // Chiudi l'overlay prima di navigare
            if (this.$route.params.visited_username !== username) {
                this.$router.push(`/profile/${username}`);
                window.location.reload()
                
            }
        },
    },
    mounted() {
        this.loadEntries(); // Carica i dati iniziali all'apertura
    },
}
</script>
<style scoped>
/* Overlay generale */
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

/* Contenitore principale dell'overlay */
.overlay-content {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    width: 400px;
    max-height: 80%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: bounceIn 0.6s ease;
}

/* Header dell'overlay */
.overlay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}

.overlay-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #333;
}

/* Corpo dell'overlay */
.overlay-body {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    padding-right: 5px;
}

/* Elemento singolo della lista */
.entry-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px; /* Spazio tra i risultati */
    border: 1px solid #ddd; /* Bordo grigio */
    border-radius: 8px; /* Angoli arrotondati */
    background-color: #f9f9f9; /* Sfondo grigio chiaro */
    cursor: pointer; /* Indicatore di cliccabilità */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Effetto di transizione */
}

.entry-item:hover {
    background-color: #cad0ff; /* Cambia colore su hover */
    transform: scale(1.02); /* Leggero zoom su hover */
}

/* Immagine del profilo */
.entry-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
    border: 1px solid #ccc; /* Bordo sottile */
}

/* Nome utente */
.entry-item span {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

/* Footer dell'overlay */
.overlay-footer {
    text-align: center;
    margin-top: 10px;
}

.overlay-footer button {
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.overlay-footer button:hover {
    background-color: #0056b3;
}

/* Animazione di rimbalzo */
@keyframes bounceIn {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    60% {
        transform: scale(1.1);
        opacity: 1;
    }
    80% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}
</style>
