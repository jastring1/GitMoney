var db = require("../models");
var axios = require("axios");
require("dotenv").config();
var keys = require("../keys");

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

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function (
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  //dashboard
  app.get("/dashboard", (req, res) => {
    axios
      .get(
        "https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=" +
        keys.appKeys.wt
      )
      .then(response => {
        const dataArr = response.data.data;
        // console.log(dataArr);
        const resObj = [];
        dataArr.forEach(el => {
          resObj.push({ price: el.price, symbol: el.symbol });
        });
        res.render("dashboard", { stocks: resObj });
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log("Error", err.message);
        }
        console.log(err.config);
      });
  });

  // axios
  //   .get("/api/stocks")
  //   .then(data => {
  //     console.log(data);
  //     res.render("dashboard", { resObj: data });
  //   })
  //   .catch(err => {
  //     if (err.response) {
  //       console.log(err.response.data);
  //       console.log(err.response.status);
  //       console.log(err.response.headers);
  //     } else if (err.request) {
  //       console.log(err.request);
  //     } else {
  //       console.log("Error", err.message);
  //     }
  //     console.log(err.config);
  //   });

  //search
  app.get("/search", (req, res) => {
    res.render("search");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
