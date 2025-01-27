<template>
    <div v-if="isOpen" class="overlay">
        <div class="overlay-content">
            <p>Login to continue</p>
            <button @click="redirectToLogin">Login</button>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/eventBus'; // Usa un EventBus per comunicare tra componenti

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        redirectToLogin() {
            if (this.$route.name !== 'login') {
                this.$router.push({ name: 'login' }); // Reindirizza solo se non sei già nella rotta login
                EventBus.$emit('closeLoginOverlay');
            }
        },
    },
};
</script>

<style scoped>
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

.overlay-content {
  background: white;
  padding: 40px;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  width: 300px;
  animation: bounceIn 0.6s ease; /* Effetto rimbalzo */
}

.overlay-content p {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.overlay-content button {
  padding: 12px 25px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.overlay-content button:hover {
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
