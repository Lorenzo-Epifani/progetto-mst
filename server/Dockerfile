FROM node:18-alpine

# Imposta la working directory nel container
WORKDIR /app

# Copia i file del backend
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice sorgente
COPY . .

# Esporta la porta su cui gira il backend
EXPOSE 3000

# Comando di avvio
CMD ["node", "app.js"]
