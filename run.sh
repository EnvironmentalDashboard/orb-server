#!/bin/bash

docker run -dit -p 3000:3000 -e HTTPS=0 --restart always orb-server
