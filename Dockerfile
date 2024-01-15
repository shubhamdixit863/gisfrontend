# Stage 1: Build the React application
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
