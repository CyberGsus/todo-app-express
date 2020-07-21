const db = require('./db')
const { migrateDb } = require('./migrate')
const collection = db.collection('todos')

module.exports = async () => {
  await migrateDb()
}
