const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Project }) {
      File.belongsTo(Project)
      File.belongsTo(File)
      File.hasMany(File)
    }
  }
  File.init({
    name: DataTypes.STRING,
    isDirectory: DataTypes.BOOLEAN,
    text: DataTypes.TEXT('long'),
    data: DataTypes.TEXT('long'),
  }, {
    sequelize,
    modelName: 'File',
  })

  return File
}
