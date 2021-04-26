// Converts an utf8 string to base64
function toBase64(x) {
  return Buffer.from(x, 'utf8').toString('base64')
}

// Converts an base64 string to utf-8
function fromBase64(x) {
  return Buffer.from(x, 'base64').toString('utf-8')
}

module.exports = {
  toBase64,
  fromBase64,
}
