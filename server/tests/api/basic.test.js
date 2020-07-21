const request = require('supertest')
const { app } = require('../../src/app')
const { closeDb } = require('../../src/migrate')

afterAll(closeDb)

describe('GET /api/v1', () => {
  it('Should respond with a standard message', async () => {
    const resp = await request(app).get('/api/v1')

    expect(resp.status).toEqual(200)
    expect(resp.body).toEqual({
      message: 'Welcome to 📓 ToDo API!',
    })
  })
})
