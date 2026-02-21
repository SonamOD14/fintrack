const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/Database");

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  merchant: {
    type: DataTypes.STRING
  },

  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: true   // important because income has no category
  },

  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  transactionTime: {
    type: DataTypes.TIME
  },

  description: {
    type: DataTypes.TEXT
  },

  status: {
    type: DataTypes.ENUM("completed", "pending"),
    defaultValue: "completed"
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  tableName: "transactions",
  timestamps: true
});

module.exports = Transaction;