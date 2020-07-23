const db = require('./db')
const collection = db.collection('todos')

const migrateDb = async () => {
  await collection.drop()
  await collection.insert([
    {
      title: 'Example',
      description: 'Example description',
      done: false,
      color: '#ff00ff',
    },
  ])
}

const closeDb = async () => {
  await db.close(true)
}

if (require.main === module) {
  migrateDb()
    .then(closeDb)
    .then(() => console.log('Migrations succeded'))
}

module.exports = { migrateDb, closeDb }
