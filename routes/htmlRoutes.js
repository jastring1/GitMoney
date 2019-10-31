var db = require("../models");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  //This returns an Array of objects that contain stock information between the two given dates passed in the url
  app.get("/historical/:symbol/:start/:end", function(req, res) {
    db.stockEntries
      .findAll({
        where: {
          symbol: req.params.symbol,
          specificDate: {
            [Op.between]: [req.params.start, req.params.end]
          }
        }
      })
      .then(function(data) {
        console.log(data)
        var stockArray = [];
        var currentHigh = 0;
        var currentLow = 1000;
        for (var i = 0; i < data.length; i++) {
          var singleDay = data[i].dataValues;
          if (singleDay.highVal > currentHigh){
            currentHigh = singleDay.highVal;
          }
          if (singleDay.lowVal < currentLow){
            currentLow = singleDay.lowVal;
          }
          var stockObj = {
            date: singleDay.specificDate,
            high: singleDay.highVal,
            low: singleDay.lowVal,
            open: singleDay.openVal,
            close: singleDay.closeVal,
            volume: singleDay.volume
          };
          stockArray.push(stockObj);
        }
        var returnObj = {
          symbol: data[0].dataValues.symbol,
          startDate: stockArray[0].date,
          endDate: stockArray[stockArray.length - 1].date,
          open: stockArray[0].open,
          close: stockArray[stockArray.length - 1].close,
          high: currentHigh,
          low: currentLow,
          change: (
            ((stockArray[stockArray.length - 1].close - stockArray[0].open) /
              stockArray[0].open) *
            100
          ).toPrecision(4)
        };
        res.render("historical-data", {
          historical: returnObj
        });
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
