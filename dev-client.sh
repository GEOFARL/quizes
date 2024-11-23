#!/bin/bash

cd client
docker-compose --env-file .env.development up --build
