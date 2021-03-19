"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT(11),
      },
      eventDetail: {
        type: DataTypes.STRING(10240),
      },
      reporterID: {
        type: DataTypes.STRING,
      },
      paymentMethod: {
        type: DataTypes.INTEGER,
      },
      productType: {
        type: DataTypes.INTEGER,
      },
      productLink: {
        type: DataTypes.STRING,
      },
      bankCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bankAccountNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eventDate: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.INTEGER,
      },
      attachedFiles: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Reports");
  },
};
