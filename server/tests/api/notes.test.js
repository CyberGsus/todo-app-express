const request = require('supertest')
const { app } = require('../../src/app')
const { migrateDb, closeDb } = require('../../src/migrate')
const { generateRandomId } = require('../helper')

beforeAll(migrateDb)
afterAll(closeDb)

describe('Get all notes', () => {
  it('Should respond to previous data in database', async () => {
    const resp = await request(app).get('/api/v1/notes')

    expect(Array.isArray(resp.body)).toBe(true)
    expect(resp.body).toHaveLength(1)

    const [user] = resp.body

    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('title', 'Example')
    expect(user).toHaveProperty('description', 'Example description')
    expect(user).toHaveProperty('done', false)
  })
})

describe('Creating notes', () => {
  it('Should make a new TODO', async () => {
    const mockToDo = {
      title: 'Example 2',
      description: 'Example valid description',
      done: true,
    }
    let resp = await request(app).post('/api/v1/notes').send(mockToDo)
    expect(resp.status).toEqual(201)
    expect(resp.body).toMatchObject(mockToDo)

    resp = await request(app).get('/api/v1/notes')

    expect(resp.body).toHaveLength(2)
    expect(resp.body[1]).toMatchObject(mockToDo)
  })
  it('Should reject request', async () => {
    const mockToDo = {
      done: true,
      description: '',
    }
    let resp = await request(app).post('/api/v1/notes').send(mockToDo)

    expect(resp.status).toBe(400)
    expect(resp.body).toHaveProperty('message')
    expect(resp.body).toHaveProperty('errors')
    expect(Array.isArray(resp.body.errors)).toBe(true)
  })
})

describe('Get note by id', () => {
  it('Should return same note', async () => {
    const note = (await request(app).get('/api/v1/notes')).body[0]
    const resp = await request(app).get(`/api/v1/notes/${note._id}`)

    expect(resp.status).toBe(200)
    expect(resp.body).toEqual(note)
  })
  it('Should not find note', async () => {
    const resp = await request(app).get(`/api/v1/notes/${generateRandomId()}`)

    expect(resp.status).toBe(404)
    expect(resp.body.message).toEqual('ToDo not found')
  })
  it('Should check for invalid ids', async () => {
    const resp = await request(app).get(`/api/v1/notes/aaaaaaaaa`)

    expect(resp.status).toBe(400)
    expect(resp.body.message).toEqual('Invalid id!')
  })
})

describe('Update notes', () => {
  it('Should handle bad requests', async () => {
    const resp = await request(app).put('/api/v1/notes').send({})

    expect(resp.status).toBe(400)
    expect(resp.body).toHaveProperty('message')
    expect(resp.body).toHaveProperty('errors')
  })

  it('Should handle missing ids', async () => {
    const dummy = {
      _id: generateRandomId(),
      description: 'Dummy',
      title: 'Dummy',
      group: 'Dummies',
    }
    const resp = await request(app).put('/api/v1/notes').send(dummy)

    expect(resp.status).toBe(404)
    expect(resp.body).toHaveProperty('message')
    expect(resp.body).toHaveProperty('reason')
  })

  it('Should return valid data', async () => {
    const prevData = (await request(app).get('/api/v1/notes')).body[0]
    const newData = Object.assign(prevData, {
      title: 'Do Chores',
      description: 'Do home chores mom said to do',
      done: true,
    })
    const resp = await request(app).put('/api/v1/notes').send(newData)

    expect(resp.status).toBe(200)
    expect(resp.body).toMatchObject(newData)
  })
})

describe('Delete notes', () => {
  it('Should handle malformed requests', async () => {
    const resp = await request(app).delete(
      `/api/v1/notes/${generateRandomId()}`
    )

    expect(resp.status).toBe(404)
    expect(resp.body).toHaveProperty('message')
    expect(resp.body).toHaveProperty('reason')

    expect(resp.body.message.includes('delete')).toBe(true)
  })
  it('Should handle invalid IDs ', async () => {
    const resp = await request(app).delete('/api/v1/notes/aaaaaaaaaa')
    expect(resp.status).toBe(400)
    expect(resp.body).toHaveProperty('message')
  })
  it('Should delete notes properly', async () => {
    // prepare dummy object
    const dummy = {
      title: 'Dummy Note',
      description: "Assert things don't fail",
      done: false,
      group: 'tests',
    }
    const newDummy = (await request(app).post('/api/v1/notes').send(dummy)).body
    expect(newDummy).toMatchObject(dummy)

    const resp = await request(app).delete(
      `/api/v1/notes/${newDummy._id || 'aaaaaaaa'}`
    )

    expect(resp.status).toBe(204)

    const newResp = await request(app).get('/api/v1/notes')
    expect(newResp.body.includes(newDummy)).toBe(false)
  })
})
