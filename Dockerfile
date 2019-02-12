FROM node:latest

RUN apt-get update && \
    apt-get -y upgrade

WORKDIR /src

COPY . .

RUN npm install

EXPOSE 3000
CMD sleep 99999
