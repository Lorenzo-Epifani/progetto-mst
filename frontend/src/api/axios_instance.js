// src/api/axiosInstance.js
import axios from 'axios';

// Configura l'istanza Axios
const instance = axios.create({
  baseURL: 'http://localhost:3000', // URL base del backend
  timeout: 4000, // Timeout per le richieste
});

// Interceptor per gestire le risposte
instance.interceptors.response.use(
  (response) => {
    // Restituisci la risposta se è valida
    return response;
  },
  (error) => {
    // Controlla se è un errore di autenticazione
    if (error.response && error.response.status === 401) {
      // Rimuovi il token
      localStorage.removeItem('sessionToken');
      // Reindirizza alla pagina di login
      window.location.href = '/login';
    }
    // Rifiuta l'errore per una gestione aggiuntiva
    return Promise.reject(error);
  }
);

export const createSubInstance = (subPath) => {
    return axios.create({
      baseURL: `${instance.defaults.baseURL}${subPath}`,
      timeout: instance.defaults.timeout,
      headers: instance.defaults.headers,
    });
  };

export default instance;
