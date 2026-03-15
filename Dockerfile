FROM node:18 AS builder
WORKDIR /app
COPY client/ ./client/
RUN cd client && npm install && npm run build

# Бэкенд
FROM node:18-alpine
WORKDIR /app
COPY server/ ./server/
COPY --from=builder /app/client/dist ./client/dist
RUN cd server && npm install --omit=dev

EXPOSE 3000
CMD ["node", "server/index.js"]