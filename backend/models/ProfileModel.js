const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/Database");

const UserProfile = sequelize.define("UserProfile", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  location: DataTypes.STRING,
  profession: DataTypes.STRING,
  bio: DataTypes.TEXT,
  avatar: DataTypes.TEXT,   // base64 image string
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }

}, {
  tableName: "user_profiles",
  timestamps: true,
});

module.exports = UserProfile;