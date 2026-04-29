# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and workspace configs
COPY package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/database/package.json ./packages/database/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN npm install

# Copy source files
COPY packages/types ./packages/types
COPY packages/database ./packages/database
COPY apps/backend ./apps/backend

# Build the backend
RUN npm run build --workspace=apps/backend

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "apps/backend/dist/index.js"]