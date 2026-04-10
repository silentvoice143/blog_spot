# Use Node base image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "run", "dev"]