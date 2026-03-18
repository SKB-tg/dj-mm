# FROM node:20 AS builder
FROM node:20
WORKDIR /app
COPY client/ ./client
RUN cd app/client && npm install && npm run build && cd .. && cd ..

# Бэкенд
# FROM node:20
# WORKDIR .
COPY server/ /app/server
#COPY --from=builder /client/dist ./client/dist
COPY index.js /app
RUN cd app/ && npm install #--omit=dev

EXPOSE 3000
CMD ["node", "server/index.js"]
