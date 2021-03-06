"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Report.init(
    {
      name: DataTypes.STRING,
      amount: DataTypes.FLOAT(11),
      eventDetail: DataTypes.STRING(10240),
      reporterID: DataTypes.STRING,
      paymentMethod: DataTypes.INTEGER,
      productType: DataTypes.INTEGER,
      productLink: DataTypes.STRING,
      bankCode: DataTypes.STRING,
      bankAccountNo: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      idNumber: DataTypes.STRING,
      eventDate: DataTypes.DATE,
      status: DataTypes.INTEGER,
      attachedFiles: DataTypes.JSONB,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Report",
    }
  );
  return Report;
};
