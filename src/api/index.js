const express = require('express')
const router = express.Router()
const cors = require('cors')
const notes = require('./notes')

router.use(cors())
router.use(express.json())

router.use('/notes', notes)

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to 📓 ToDo API!',
  })
})

module.exports = router
