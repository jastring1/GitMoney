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

  //dashboard
  app.get("/dashboard", (req, res) => {
    res.render("dashboard");
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
