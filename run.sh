#!/bin/bash

docker run -dit -p 3000:3000 -e HTTPS=0 --restart always --env "DB_HOST" --env "DB_PORT" --env "DB_USER" --env "DB_PWD" --env "DB_NAME" --env-file src/app/config/orb-server.env -v $(pwd)/src:/orb-server/src orb-server
