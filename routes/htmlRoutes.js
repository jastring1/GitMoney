var db = require("../models");

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

  // Load example page and pass in an example by id
  app.get("/:symbol/:date", function(req, res) {
    db.stockEntries
      .findAll({
        where: { symbol: req.params.symbol, specificDate: req.params.date }
      })
      .then(function(dbExample) {
        var singleDay = dbExample[0].dataValues;
        var returnObj = {
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
          example: returnObj
        });
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
