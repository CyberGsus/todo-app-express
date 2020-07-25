const express = require('express')
const middlewares = require('./middlewares')

const app = express()
const endpoints = { api: '/api/v1' }

require('dotenv').config()

middlewares(app, endpoints)

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`💻 Listening on http://localhost:${server.address().port}`)
    if (endpoints.api) {
      console.log(`API @ ${endpoints.api}`)
    }
  })
}

module.exports = { app }
