const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, File }) {
      Project.belongsTo(User)
      Project.hasMany(File)
    }
  }
  Project.init({
    slug: DataTypes.STRING,
    name: DataTypes.STRING,
    isPrivate: DataTypes.BOOLEAN,
    hierarchy: DataTypes.TEXT('long'),
  }, {
    sequelize,
    modelName: 'Project',
  })

  return Project
}
