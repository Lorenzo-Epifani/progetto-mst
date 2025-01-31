<template>
    <div id="navbar" class="md-elevation-14">
        <md-tabs class="md-accent" md-alignment="right">
            <!-- Bottone Home -->
            <md-tab
            id="tab-home"
            md-label="Home"
            md-icon="dashboard"
            @click="goTo('/home')"
            ></md-tab>
            
            <!-- Bottone Login o Profilo -->
            <md-tab
            v-if="!isLoggedIn"
            id="tab-login"
            md-label="Login"
            md-icon="login"
            @click="goTo('/login')"
            ></md-tab>
            <md-tab
            v-else
            id="tab-profile"
            md-label="MyProfile"
            md-icon="accessibility"
            @click="goTo('/profile')"
            ></md-tab>
            
            <!-- Bottone Logout -->
            <md-tab
            v-if="isLoggedIn"
            id="tab-logout"
            md-label="Logout"
            md-icon="logout"
            @click="deleteToken()"
            ></md-tab>
            
            <!-- Bottone Search -->
            <md-tab
            id="tab-search"
            md-label="Search"
            md-icon="search"
            @click="toggleSearchBox"
            ></md-tab>
        </md-tabs>
        
        <!-- Search Box -->
        <SearchBox ref="searchBox" />
    </div>
</template>


<script>
import SearchBox from './overlay/SearchBox.vue';

export default {
    name: "NavBar",
    components: {
        SearchBox,
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('sessionToken');
        }
    },
    mounted() {
        // Aggiungi un watcher per il cambio di rotta
        this.$watch('$route', () => {
            this.$refs.searchBox.closeSearch();
        });
    },
    methods: {
        goTo(route) {
            if (this.$route.path !== route) {
                this.$router.push(route);
            }
        },
        deleteToken() {
            localStorage.removeItem("sessionToken");
            this.$router.push("/login");
            window.location.reload();
            return
        },
        toggleSearchBox() {
            this.$refs.searchBox.openSearch();
        },
        
    },
};
</script>

<style>
.md-tabs {
    margin-top: 8px;
    background-color: darkblue;
}

div#navbar .md-button-content {
    font-weight: bold;
    font-size: 150%;
    color: white;
}

div#navbar .md-button-content:hover {
    animation: lds-beat 0.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

@keyframes lds-beat {
    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }
    40% {
        transform: scale(0.97);
        opacity: 0.7;
    }
    80% {
        transform: scale(1.03);
        opacity: 1;
    }
}
</style>
