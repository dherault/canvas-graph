module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slug: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      isPrivate: {
        type: Sequelize.BOOLEAN,
      },
      data: {
        type: Sequelize.TEXT('long'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sources')
  },
}
