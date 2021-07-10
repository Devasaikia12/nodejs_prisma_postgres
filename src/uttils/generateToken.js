const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: process.env.DB_ENV === 'testing' ? '1d' : '7d',
  })
}

module.exports = generateToken
