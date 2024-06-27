FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./public ./public
COPY server.js .
ENV GOOGLE_CLIENT_ID ""
ENV GOOGLE_CLIENT_SECRET ""
ENV CHAT_BACKEND_URL ""
ENV BACKEND_URL ""
ENV WEBSOCKETS_URL ""
EXPOSE 3000

CMD ["node", "server.js"]

