const express = require('express')
const yup = require('yup')

const notes = express.Router()
const { db, emitter } = require('../db')
const collection = db.collection('todos')

let dbConnected = false
emitter.on('connected', () => {
  dbConnected = true
})

const schema = yup.object().shape({
  title: yup.string().trim().min(3).required(),
  description: yup.string().trim().default('No description'),
  done: yup.boolean().default(false),
  color: yup
    .string()
    .default('#fff')
    .matches(/^#(?:[0-9a-f]{3}){1,2}$/i),
})

notes.use((req, res, next) => {
  if (!dbConnected || res.headersSent) {
    res
      .status(500)
      .json({
        message: `Wait! I'm not ready yet! 😞`,
      })
      .end()
  } else next()
})

notes.get('/', async (req, res, next) => {
  try {
    res.json(await collection.find())
  } catch (err) {
    next(err)
  }
})

notes.get('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const got = await collection.findOne({ _id: id })
    if (got === null) {
      res.status(404).json({ message: 'ToDo not found' })
    } else {
      res.json(got)
    }
  } catch (err) {
    if (err.message.startsWith('Argument passed')) {
      res.status(400).json({ message: 'Invalid id!' })
    } else {
      next(err)
    }
  }
})

notes.post('/', async (req, res, next) => {
  // TODO: create a todo
  try {
    const { title, description, done, color } = req.body
    await schema.validate({
      title,
      description,
      done,
      color,
    })
    const got = schema.cast({ title, description, done, color })
    await collection.insert(got)
    res.status(201).json(got)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid body', errors: err.errors })
    } else {
      next(err)
    }
  }
})

notes.put('/', async (req, res, next) => {
  try {
    const { _id, title, description, done, color } = req.body
    await schema.validate({
      title,
      description,
      done,
      color,
    })
    const cast = schema.cast({ title, description, done, color })
    cast['_id'] = _id
    const got = await collection.findOne({ _id })
    if (got === null) {
      res.status(404).json({
        message: 'Could not update note',
        reason: 'Not found',
      })
    } else {
      await collection.update({ _id }, { $set: cast })
      res.json(cast)
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({
        message: 'Invalid body',
        errors: err.errors,
      })
    } else if (err.message.startsWith('Argument passed')) {
      res.status(400).json({
        message: 'Invalid ID',
      })
    } else {
      next(err)
    }
  }
})

notes.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const obj = await collection.findOneAndDelete({ _id: id })
    if (obj === null) {
      res.status(404).json({
        message: 'Could not delete note',
        reason: 'Note not found',
      })
    } else {
      res.status(204).send()
    }
  } catch (err) {
    if (err.message.startsWith('Argument passed')) {
      res.status(400).json({
        message: 'Invalid ID',
      })
    } else {
      next(err)
    }
  }
})

notes.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
})

module.exports = notes
