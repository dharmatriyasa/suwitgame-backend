'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: "UserRooms",
        foreignKey: {
          name: "roomId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        
      });

      this.hasMany(models.Round, {
        foreignKey: {
          name: "roomId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
      })
    }
  };
  Room.init({
    roomName: DataTypes.STRING,
    playerWinId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};