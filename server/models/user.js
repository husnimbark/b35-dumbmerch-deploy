"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
     
      user.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser",
        },
      });

      user.hasMany(models.product, {
        as: "products",
        foreignKey: {
          name: "idUser",
        },
      });

      user.hasMany(models.transaction, {
        as: "buyerTransactions",
        foreignKey: {
          name: "idBuyer",
        },
      });
      user.hasMany(models.transaction, {
        as: "sellerTransactions",
        foreignKey: {
          name: "idSeller",
        },
      });

      user.hasMany(models.cart, {
        as: "buyerCarts",
        foreignKey: {
          name: "idBuyer",
        },
      });
      user.hasMany(models.cart, {
        as: "sellerCarts",
        foreignKey: {
          name: "idSeller",
        },
      });

      user.hasMany(models.chat, {
        as: "senderMessage",
        foreignKey: {
          name: "idSender",
        },
      });
      user.hasMany(models.chat, {
        as: "recipientMessage",
        foreignKey: {
          name: "idRecipient",
        },
      });
    }
  }
  user.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
