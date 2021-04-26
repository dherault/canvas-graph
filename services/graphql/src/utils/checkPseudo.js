const db = require('../../../database/models')

async function checkPseudo(pseudo) {
  if (!validatePseudo(pseudo)) return false

  const existingUserWithPseudo = await db.User.findOne({
    where: {
      pseudo,
    },
  })

  return !existingUserWithPseudo
}

const allowedCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'

function validatePseudo(pseudo) {
  return pseudo.length > 2 && pseudo.length <= 16 && pseudo.split('').every(character => allowedCharacters.includes(character))
}

module.exports = checkPseudo
