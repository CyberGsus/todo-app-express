const monk = require('monk')

const db = monk('localhost/todo')
if (process.env.NODE_ENV !== 'test') {
  db.then(() => {
    console.log('💾 Database is up!')
  })
}

db.addMiddleware(require('monk-middleware-wrap-non-dollar-update'))

if (process.env.NODE_ENV === 'dev') {
  db.addMiddleware(require('monk-middleware-debug'))
}
module.exports = db
