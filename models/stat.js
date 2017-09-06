'use strict';
module.exports = function(sequelize, DataTypes) {
  var Stat = sequelize.define('Stat', {
    actId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    quantity: DataTypes.INTEGER
  }, {});

  Stat.associate = function(models) {
    Stat.belongsTo(models.Activity, {
      as: "Activities",
      foreignKey: "actId"
    })
  }

  return Stat;
};
