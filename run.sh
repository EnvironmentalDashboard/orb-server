#!/bin/bash

docker run -dit -p 3000:3000 -v /etc/ssl/environmentalorb.org:/etc/ssl/environmentalorb.org orb-server
