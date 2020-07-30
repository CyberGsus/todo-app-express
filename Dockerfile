FROM node:alpine
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV docker
ENV MONGO_URI mongodb
ARG PORT=8081
WORKDIR /usr/src/app
COPY server .
RUN npm install --verbose
RUN echo PORT=${PORT} MONGO_URI=${MONGO_URI} > .env
EXPOSE ${PORT}
ENTRYPOINT [ "npm", "run", "start:docker" ]
