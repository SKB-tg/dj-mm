FROM node:20 AS builder
WORKDIR /app
COPY client/ .
RUN npm install && npm run build

# Бэкенд
FROM node:20
WORKDIR /app
#COPY server/ ./server/
COPY --from=builder /app/dist ./client/dist
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "server/index.js"]
