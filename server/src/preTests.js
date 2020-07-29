const { migrateDb } = require('./migrate')
const { emitter } = require('./db')

let dbConnected = false
emitter.on('connected', () => {
  dbConnected = true
})

module.exports = async () => {
  await migrateDb()
}
