const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Source }) {
      User.hasMany(Source)
    }
  }
  User.init({
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    pseudo: DataTypes.STRING,
    profileImageUrl: DataTypes.STRING,
    hasCompletedOnboarding: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  })

  return User
}
