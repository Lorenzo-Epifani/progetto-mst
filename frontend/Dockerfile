# Usa un'immagine Node.js per la build
FROM node:18-alpine AS build-stage

# Imposta la working directory
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file
COPY . .

# Compila il progetto Vue.js
RUN npm run build

# Usa un'immagine Nginx per servire il frontend
FROM nginx:stable-alpine AS production-stage

# Copia i file generati dalla build Vue
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Esponi la porta 80
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
