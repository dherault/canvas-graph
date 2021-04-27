const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Source extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, File }) {
      Source.belongsTo(User)
      Source.hasMany(File)
    }
  }
  Source.init({
    slug: DataTypes.STRING,
    name: DataTypes.STRING,
    isPrivate: DataTypes.BOOLEAN,
    hierarchy: DataTypes.TEXT('long'),
  }, {
    sequelize,
    modelName: 'Source',
  })

  return Source
}
