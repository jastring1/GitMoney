module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    symbol: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue("symbol", val.toUpperCase());
      },
      allowNull: false,
      validate: {
        len: [1, 5]
      }
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        // notEmpty: true,
        len: [0, 144]
      }
    }
  });
  return Favorite;
};
