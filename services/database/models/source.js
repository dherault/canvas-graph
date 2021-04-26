const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Source extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      Source.belongsTo(User)
    }
  }
  Source.init({
    slug: DataTypes.STRING,
    name: DataTypes.STRING,
    isPrivate: DataTypes.BOOLEAN,
    data: DataTypes.TEXT('long'),
  }, {
    sequelize,
    modelName: 'Source',
  })

  return Source
}
