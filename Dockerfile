FROM node:16.17.0
WORKDIR /app
RUN npm install -g npm@9.8.1
COPY package.json .
COPY package-lock.json .
ARG NODE_ENV
RUN npm install
COPY . .
ENV PORT 8000
EXPOSE $PORT