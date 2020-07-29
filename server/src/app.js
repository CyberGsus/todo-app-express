const express = require('express')
const middlewares = require('./middlewares')
const serverless = require('serverless-http')
const fs = require('fs')

const app = express()
const endpoints = { api: '/api/v1' }

require('dotenv').config()

middlewares(app, endpoints)

if (fs.existsSync('../public')) {
  app.use('/', express.static('../public'))
}

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`💻 Listening on http://localhost:${server.address().port}`)
    if (endpoints.api) {
      console.log(`API @ ${endpoints.api}`)
    }
  })
}

module.exports = { app: serverless(app) }
