docker-compose up --buildFROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./public ./public
COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
