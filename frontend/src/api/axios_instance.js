// src/api/axiosInstance.js
import axios from 'axios';
import { EventBus } from '@/eventBus'; // Usa un EventBus per comunicare tra componenti

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
    const sub_instance = axios.create({
      baseURL: `${instance.defaults.baseURL}${subPath}`,
      timeout: instance.defaults.timeout,
      headers: instance.defaults.headers,
    });
    sub_instance.interceptors.response.use(
        (response) => response, // Restituisci le risposte valide
        (error) => {
            console.log("FORCE_TO_LOGIN")
          // Se il codice di stato è 423, attiva l'evento di apertura dell'overlay
          if (error.response && error.response.status === 423) {
            EventBus.$emit('openLoginOverlay');
          }
          //return Promise.reject(error); // Propaga l'errore
        }
      );
      return sub_instance
  };

export default instance;
