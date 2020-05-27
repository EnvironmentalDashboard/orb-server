#!/bin/bash

docker run -dit -p 3000:3000 -e HTTPS=0 --restart always -e "DB_HOST=159.89.232.129" -e "DB_PORT=3306" -e "DB_USER=rowan" -e "DB_PWD=runescap3" -e "DB_NAME=oberlin_environmentaldashboard" -v $(pwd)/src:/orb-server/src orb-server 
