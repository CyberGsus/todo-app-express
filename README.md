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

2. Install dependencies

```bash
yarn setup:\*
```

3. Build client side

```bash
yarn build:client
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
yarn start
```

## Notes

- Installation of modules is per-se, backend is completely separated from frontend
- Server side requires `mongod` to be installed in your system and on the `PATH` variable in order to run the database
- Backend just serves an API with a mongodb database at `/api/v1`, you can use other endpoints to make a static file server
