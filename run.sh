#!/bin/bash

docker run -dit -p 3000:3000 -e HTTPS=0 --restart always  --env-file src/app/config/orb-server.env -v $(pwd)/src:/orb-server/src orb-server
