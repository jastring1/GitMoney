/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  var stockEntries = sequelize.define(
    "stockEntries",
    {
      specificDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "specific_date"
      },
      openVal: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "open_val"
      },
      highVal: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "high_val"
      },
      lowVal: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "low_val"
      },
      closeVal: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "close_val"
      },
      volume: {
        type: DataTypes.INTEGER(12),
        allowNull: false,
        field: "volume"
      },
      symbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "symbol"
      }
    },
    {
      tableName: "stock_entries"
    }
  );
  return stockEntries;
};
