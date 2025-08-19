FROM node:24-alpine AS builder
WORKDIR /app
COPY FrontEnd/package*.json ./
RUN npm ci
COPY FrontEnd/ .
COPY .env .env
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY FrontEnd/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
