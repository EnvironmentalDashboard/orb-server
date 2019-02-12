FROM node:latest

RUN apt-get update && \
    apt-get -y upgrade

WORKDIR /orb-server

COPY . .

RUN npm install

EXPOSE 3000
CMD node /orb-server/src/app/app.js
