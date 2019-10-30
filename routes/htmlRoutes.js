var db = require("../models");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });
  // Renders example.handlebars with an object containing stock data for a specific day
  app.get("/historical/:symbol/:date", function (req, res) {
    db.stockEntries
      .findAll({
        where: { symbol: req.params.symbol, specificDate: req.params.date }
      })
      .then(function (data) {
        var singleDay = data[0].dataValues;
        var stockObj = {
          symbol: singleDay.symbol,
          date: singleDay.specificDate,
          open: singleDay.openVal,
          close: singleDay.closeVal,
          change: (
            ((singleDay.closeVal - singleDay.openVal) / singleDay.openVal) *
            100
          ).toPrecision(4),
          high: singleDay.highVal,
          low: singleDay.lowVal,
          volume: singleDay.volume
        };
        res.render("example", {
          example: stockObj
        });
      });
  });
  //This returns an Array of objects that contain stock information between the two given dates passed in the url
  app.get("/historical/:symbol/:start/:end", function (req, res) {
    db.stockEntries
      .findAll({
        where: {
          symbol: req.params.symbol, 
          specificDate: {
            [Op.between]:  [req.params.start, req.params.end]
          }
        }
      })
      .then(function (data) {
        var stockArray = [];
        for (var i = 0; i < data.length; i++) {
          var singleDay = data[i].dataValues;
          var stockObj = {
            date: singleDay.specificDate,
            high: singleDay.highVal,
            low: singleDay.lowVal,
            open: singleDay.openVal,
            close: singleDay.closeVal,
            volume: singleDay.volume
          }
          stockArray.push(stockObj);
        }
        var returnObj = {
          symbol: data[0].dataValues.symbol,
          startDate: stockArray[0].date,
          endDate: stockArray[stockArray.length - 1].date,
          open: stockArray[0].open,
          close: stockArray[stockArray.length - 1].close,
          change: ((((stockArray[stockArray.length - 1].close) - stockArray[0].open) / stockArray[0].open) * 100).toPrecision(4)
        }
        res.render("example2", {
          example: returnObj
        });
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
}
