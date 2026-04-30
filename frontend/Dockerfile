# Étape 1 : Construction
FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Service avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copie d'une config nginx personnalisée si nécessaire
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
