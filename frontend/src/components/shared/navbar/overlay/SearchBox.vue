<template>
    <div class="search-box-overlay" :class="{ open: isOpen }">
        <div class="search-header">
            <button class="close-button" @click="closeSearch">✖</button>
            <h3>Search</h3>
        </div>
        <div class="search-input">
            <input
            type="text"
            v-model="searchQuery"
            placeholder="Cerca profili..."
            @input="onSearchInput"
            />
        </div>
        <!-- Risultati della ricerca -->
        <div class="search-results">
            <p v-if="!temp_results.length && searchQuery">Nessun risultato trovato.</p>
            <div
            v-for="(result, index) in temp_results"
            :key="index"
            class="result-item"
            @click="navigateToProfile(result.username)"
            >
            <img :src="result.img" alt="Profile Image" class="profile-icon" />
            <span class="username">{{ result.username }}</span>
        </div>
    </div>
</div>
</template>



<script>
import * as shared_api from "@/api/shared.js";

export default {
    name: 'SearchBox',
    data() {
        return {
            isOpen: false, // Controlla se la box è aperta
            searchQuery: '', // Query di ricerca
            temp_results:[]
        };
    },
    methods: {
        openSearch() {
            this.isOpen = true;
        },
        closeSearch() {
            this.isOpen = false;
        },
        async onSearchInput() {
            // Gestione futura della ricerca
            this.temp_results = (await shared_api.search_user(this.searchQuery)).data
            console.log(this.temp_results)
        },
        navigateToProfile(username) {
            const targetRoute = `/profile/${username}`;
            
            this.closeSearch(); 
            // Controlla se sei già nella rotta di destinazione
            if (this.$route.path !== targetRoute) {
                this.$router.push(targetRoute); // Naviga solo se è una rotta diversa
                window.location.reload()
                
            }         
        }
    },
};
</script>

<style scoped>
.search-box-overlay {
    position: fixed;
    top: 0;
    right: -100%;
    width: 300px;
    height: 100%;
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    transition: right 0.3s ease;
}

.search-box-overlay.open {
    right: 0;
}

.search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    background-color: #f9f9f9;
}

.search-header h3 {
    margin: 0;
    font-size: 18px;
}

.close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #333;
}

.search-input {
    padding: 15px;
}

.search-input input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.search-results {
    padding: 2px;
    font-size: 18px;
    color: #666;
}

.result-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 3px; /* Spazio tra i risultati */
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.result-item:hover {
    background-color: #cad0ff;
}

.profile-icon {
    width: 30px; /* Dimensione piccola */
    height: 30px;
    border-radius: 50%; /* Mantieni immagine rotonda */
    object-fit: cover;
    margin-right: 10px; /* Spazio tra immagine e testo */
}

.username {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}
</style>
