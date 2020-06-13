"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tweets", {
      tweet_id: {
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
        allowNull: false,
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Tweets");
  },
};
