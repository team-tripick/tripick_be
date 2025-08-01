const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Logs = sequelize.define(
  'Logs',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    log: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, //언제 생성되었는지 수정되었는지 저장하게 함
  }
);

module.exports = Logs;
