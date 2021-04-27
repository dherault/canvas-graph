const db = require('../../../database')

const { slugLength } = require('../configuration')

async function createSlug(length = slugLength) {
  const slug = generateSlug(length)

  while (true) {
    const nProjects = await db.Project.count({ where: { slug } })

    if (nProjects === 0) break
  }

  return slug
}

const allowedCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'

function generateSlug(length) {
  let slug = ''

  for (let i = 0; i < length; i++) {
    slug += allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)]
  }

  return slug
}

module.exports = createSlug
