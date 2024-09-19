# Step 1: Build the React app
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the app using an Nginx server
FROM nginx:alpine

# Copy the build output from the previous step to Nginx's default html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file (optional if you want to customize Nginx)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for serving the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
