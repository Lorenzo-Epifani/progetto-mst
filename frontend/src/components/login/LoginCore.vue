<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                type="text"
                id="username"
                v-model="username"
                placeholder="Enter your username"
                required
                />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required
                />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
// Importa la tua funzione per autenticare l'utente
import * as api  from '@/api/login.js';

export default {
    name: "LoginForm",
    data() {
        return {
            username: "",
            password: "",
            errorMessage: "", // Per visualizzare eventuali messaggi di errore
        };
    },
    methods: {
        async handleLogin() {
            // Resetta il messaggio di errore
            this.errorMessage = "";
            
            // Verifica se i dati sono mancanti
            if (!this.username || !this.password) {
                this.errorMessage = "Missing Data";
                return;
            }
            
            // Chiama la funzione di autenticazione
            try{
            var login_response = await api.login(this.username, this.password);
            }
            catch(err){
                login_response = err
            }

            if (!login_response || login_response.status!=200){
                this.errorMessage = "Authentication Failed";
                return;
            }
            var token = login_response.data
            // Salva il token nel localStorage o gestiscilo come richiesto
            localStorage.setItem("sessionToken", token);
            
            window.location.reload()
            this.$router.push("/profile"); 
        },
    },
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
}
</style>
