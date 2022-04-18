'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoom extends Model {
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
      });
      
      this.belongsTo(models.User, {
        foreignKey:{
          name: "roomMasterId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        }
      });

      this.belongsTo(models.User, {
        foreignKey:{
          name: "roomEnemyId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        }
      })
    }
  };
  UserRoom.init({
    roomMasterId: DataTypes.INTEGER,
    roomEnemyId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRoom',
  });
  return UserRoom;
};