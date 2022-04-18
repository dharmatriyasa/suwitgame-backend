'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomMasterId: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users",
          },
          key: "id",
        },
        allowNull: true
      },
      roomEnemyId: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Users",
          },
          key: "id",
        },
        allowNull: true
      },
      roomId: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "Rooms",
          },
          key: "id",
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserRooms');
  }
};