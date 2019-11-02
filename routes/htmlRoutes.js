var db = require("../models");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;
var axios = require("axios");
require("dotenv").config();
var keys = require("../keys");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Example.findAll({}).then(function () {
      res.render("index", {});
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
        console.log(data);
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

  //dashboard
  app.get("/dashboard", (req, res) => {
    res.render("dashboard");
  
    // axios
    //   .get(
    //     "https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=" +
    //     keys.appKeys.wt
    //   )
    //   .then(response => {
    //     const dataArr = response.data.data;
    //     // console.log(dataArr);
    //     const resObj = [];
    //     dataArr.forEach(el => {
    //       resObj.push({ price: el.price, symbol: el.symbol });
    //     });
    //     res.render("dashboard", { stocks: resObj });
    //   })
    //   .catch(err => {
    //     if (err) throw err;
    //   });
  });

  //live-search
  app.get("/search", (req, res) => {
    res.render("search");
  });

  //historical-search
  app.get("/search-historical", (req, res) => {
    res.render("search-historical");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
