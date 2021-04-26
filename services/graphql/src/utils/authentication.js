const jwt = require('jsonwebtoken')

const { tokenSecret, tokenExpiration } = require('../configuration')

function verifyToken(token) {
  return jwt.verify(token, tokenSecret).id
}

function generateToken(id) {
  return jwt.sign({ id }, tokenSecret, { expiresIn: tokenExpiration })
}

module.exports = {
  verifyToken,
  generateToken,
}
