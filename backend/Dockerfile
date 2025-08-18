FROM node:24-alpine

WORKDIR /app

# Install dependencies first (use lockfile if present)
COPY package*.json ./
# Use npm install to avoid strict lockfile sync errors in CI/builds
RUN npm install --omit=dev

# Copy source code
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
