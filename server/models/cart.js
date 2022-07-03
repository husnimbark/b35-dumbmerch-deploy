"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    static associate(models) {
      cart.belongsTo(models.product, {
        as: "product",
        foreignKey: {
          name: "idProduct",
        },
      });

      cart.belongsTo(models.user, {
        as: "cartBuyer",
        foreignKey: {
          name: "idBuyer",
        },
      });

      cart.belongsTo(models.user, {
        as: "cartSeller",
        foreignKey: {
          name: "idSeller",
        },
      });
    }
  }
  cart.init(
    {
      idProduct: DataTypes.INTEGER,
      idBuyer: DataTypes.INTEGER,
      idSeller: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "cart",
    }
  );
  return cart;
};
