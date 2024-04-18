# Use an official Node runtime as the parent image
FROM node:21-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

WORKDIR /app

# Bundle app source inside the Docker image
COPY . .
CMD ["npm", "run", "start"]