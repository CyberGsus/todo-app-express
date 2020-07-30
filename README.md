# todo-app

This is a fullstack starter project
I'm developing to get better at Nodejs & Vue.

Will also dockerize the app.

## Setup

To setup everything just do:

1. Clone the repository

```bash
git clone https://github.com/CyberGsus/todo-app-express.git
cd todo-app-express
```

You can do either [container setup](#container-setup-with-docker-compose) or [local setup](#local-setup)

### Container setup with `docker-compose`

**Note** that this works only on linux containers.<br>

2. If you have `docker-compose` installed, just run

```bash
docker-compose up
```

from the root directory. This will spin up the server on port
`8080`

### Local setup

2. Install dependencies

```bash
npm run setup:\*
```

3. Build client side

```bash
npm run build:client
```

4. Go to server side

```bash
cd server
```

5. Remove all example things from database

```
rm -rf db
```

6. Start server

```
npm run start
```

## Dockerize

### Build your own image

To dockerize the app, you have 2 options, with client and without client
In order to build the app with the client just do `npm run build:client` before
`docker-compose up/build`

- There's a development `docker-compose` version, use this one to build the server
  and use `nodemon`

### Already built images

- `cybercyclonic/notes-app:api-only` contains the API only, you can override default environment with `MONGO_URI` and `PORT`
- `cybercyclonic/notes-app:latest` contains the API with built client

## Notes

- Installation of modules is per-se, backend is completely separated from frontend
- Server side requires `mongod` to be installed in your system and on the `PATH` variable in order to run the database
- Backend just serves an API with a mongodb database at `/api/v1`, you can use other endpoints to make a static file server
