FROM node:24-alpine

WORKDIR /app

# Install dependencies first (use lockfile if present)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy source code
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
