# Base image
FROM node:18-alpine

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 4000

# Default command
CMD ["npm", "run", "start:dev"]
