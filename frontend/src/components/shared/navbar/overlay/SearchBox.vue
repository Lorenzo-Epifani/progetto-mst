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
      <!-- Spazio per i risultati della ricerca (da implementare in futuro) -->
      <div class="search-results">
        <p v-if="searchQuery">Risultati per "{{ searchQuery }}" (TODO)</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBox',
    data() {
      return {
        isOpen: false, // Controlla se la box è aperta
        searchQuery: '', // Query di ricerca
      };
    },
    methods: {
      openSearch() {
        this.isOpen = true;
      },
      closeSearch() {
        this.isOpen = false;
      },
      onSearchInput() {
        // Gestione futura della ricerca
        console.log('Input di ricerca:', this.searchQuery);
      },
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
    padding: 15px;
    font-size: 14px;
    color: #666;
  }
  </style>
  