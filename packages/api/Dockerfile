FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

## The wait.sh script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# Install lerna
RUN npm i lerna -g

# Install lerna dependencies
COPY package*.json ./
COPY lerna.json .
RUN npm install

# Copy app source
COPY ./packages/api ./packages/api
COPY ./packages/api-common ./packages/api-common
COPY ./packages/common ./packages/common

# Remove .env file
RUN rm ./packages/api/.env*

# Lerna bootstrap
RUN lerna bootstrap

# Port to expose
EXPOSE 4000

# Run app
CMD /wait && cd packages/api && yarn start
