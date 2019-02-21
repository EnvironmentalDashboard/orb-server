FROM node:11.10.0
WORKDIR /orb-server
COPY *.json /orb-server/
RUN apt-get update && apt-get -y upgrade && npm install
COPY . .
EXPOSE 3000
CMD node /orb-server/src/app/app.js
