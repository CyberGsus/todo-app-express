const { db } = require('./db')

module.exports = async () => {
  await db.collection('todos').drop()
  await db.close(true)
}
