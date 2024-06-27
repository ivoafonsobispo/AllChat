FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./public ./public
COPY server.js .


EXPOSE 3000

ENV GOOGLE_CLIENT_ID ""
ENV GOOGLE_CLIENT_SECRET ""
ENV BACKEND_URL ""
ENV WEBSOCKETS_URL ""
ENV CHAT_BACKEND_URL ""
CMD ["node", "server.js"]
