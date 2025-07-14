FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 5555 (to match docker-compose)
EXPOSE 5555

# Start development server with hot reload
CMD ["npm", "run", "start:dev"]
