const monk = require('monk')
const { EventEmitter } = require('events')
const mongo_uri = process.env.MONGO_URI || 'localhost'

const emitter = new EventEmitter()

const db = monk(`${mongo_uri}/todo`)
db.then(() => {
  if (process.env.NODE_ENV !== 'test') console.log('💾 Database is up!')
  emitter.emit('connected')
})

db.addMiddleware(require('monk-middleware-wrap-non-dollar-update'))

if (process.env.NODE_ENV === 'dev') {
  db.addMiddleware(require('monk-middleware-debug'))
}
module.exports = { db, emitter }
