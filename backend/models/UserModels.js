const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/Database");

const User = sequelize.define(
  "UserModel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user"
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },

    TokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },

    monthlyBudget: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  },
  {
    tableName: "users",
    timestamps: true
  }
);

module.exports = User;
