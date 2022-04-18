'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Room, {
        through: "UserRooms",
        foreignKey: {
          name: "roomMasterId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      });

      this.belongsToMany(models.Room, {
        through: "UserRooms",
        foreignKey: {
          name: "roomEnemyId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
      });
    }
  };
  User.init({
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};