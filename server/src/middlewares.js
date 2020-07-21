const morgan = require('morgan')

module.exports = (app, data = {}) => {
  if (process.env.NODE_ENV !== 'test')
    app.use(
      morgan({ production: 'tiny', dev: 'dev' }[process.env.NODE_ENV] || 'dev')
    )
  const { api } = data
  if (typeof api === 'string') {
    app.use(api, require('./api'))
  }
  return data
}
