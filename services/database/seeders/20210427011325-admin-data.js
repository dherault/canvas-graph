const adminUsers = require('../data/admin-users.json')
const adminProjects = require('../data/admin-projects.json')
const adminFiles = require('../data/admin-files.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Users', adminUsers, {})
    await queryInterface.bulkInsert('Projects', adminProjects, {})
    await queryInterface.bulkInsert('Files', adminFiles, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
