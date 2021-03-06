"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tweets", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      fromUser: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      toUser: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      tweet: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      likes: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Tweets");
  },
};
