'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productCategory extends Model {

    static associate(models) {
    }
  };
  productCategory.init({
    idProduct: DataTypes.INTEGER,
    idCategory: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'productCategory',
  });
  return productCategory;
};