'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Room, {
        foreignKey:{
          name: "roomId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        }
      })
    }
  };
  Round.init({
    player1Select: DataTypes.STRING,
    player2Select: DataTypes.STRING,
    resultId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Round',
  });
  return Round;
};