#!/bin/sh
set -e
set -x

GREEN='\033[0;32m'
NC='\033[0m'

printf "${GREEN}Running migrations...${NC}\n"
npx typeorm migration:run -d dist/database/default/datasource.js

printf "${GREEN}Starting application...${NC}\n"
exec node dist/main.js