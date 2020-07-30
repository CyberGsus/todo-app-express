const express = require('express')
const middlewares = require('./middlewares')
const fs = require('fs')

const app = express()
const endpoints = { api: '/api/v1' }

require('dotenv').config()

middlewares(app, endpoints)

console.log(
  __dirname + '/../public',
  fs.existsSync(__dirname + '/../public') ? 'exists' : 'does not exist'
)

if (fs.existsSync(__dirname + '/../public')) {
  console.log('Public exists!')
  app.use('/', express.static(__dirname + '/../public'))
}

if (process.NODE_ENV !== 'test') {
  const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`💻 Listening on http://0.0.0.0:${server.address().port}`)
    if (endpoints.api) {
      console.log(`API @ ${endpoints.api}`)
    }
  })
}

module.exports = { app }
