const db = require('../models')

db.sequelize.sync().then(() => {
  console.log('Database created')

  process.exit(0)
})
