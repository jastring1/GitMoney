var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  app.get("/api/:symbol/:date", function(req, res) {
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
          high: singleDay.highVal,
          low: singleDay.lowVal,
          volume: singleDay.volume
        };
        res.json(returnObj);
      });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
