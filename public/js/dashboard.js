var $favSubmitBtn = $("#favoriteSubmit");
var $favoriteList = $("#favoriteList");
var count = 0;

const reloadFavorites = () => {
  $.ajax({
    url: "/api/favorites",
    type: "GET"
  }).then(data => {
    var $favorites = data.map(function (favorite) {
      var $btn = $("<button>")
        .attr({
          class: "stockLink",
          "data-value": favorite.symbol
        })
        .text(favorite.symbol);

      var $n = $("<br/><a>")
        .attr({
          class: "faveNote",
          "data-note": favorite.note
        })
        .text(favorite.note);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": favorite.id
        })
        .append($btn);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);
      $li.append($n);

      return $li;
    });

    $favoriteList.empty();
    $favoriteList.append($favorites);
  });
};

const handleFavSubmit = event => {
  event.preventDefault();

  let favorite = {
    symbol: $("#symbolInput")
      .val()
      .trim(),
    note: $("#noteInput")
      .val()
      .trim()
  };

  if (!favorite.symbol) {
    return $("#invalidSymbol").modal("show");
  }

  if (favorite.symbol.length > 5) {
    return $("#tooLongSymbol").modal("show");
  }

  $.ajax({
    type: "POST",
    url: "/api/favorites",
    data: favorite
  }).then(() => {
    reloadFavorites();
    $("#symbolInput").val("");
    $("#noteInput").val("");
  });
};

var handleFavDelete = function () {
  let delId = $(this)
    .parent()
    .attr("data-id");
  console.log(delId);
  $.ajax({
    url: "/api/favorites/" + delId,
    type: "DELETE"
  }).then(() => {
    reloadFavorites();
  });
};

var handleDeleteChart = function () {
  let clickedChart = $(this).attr("data-chart");
  console.log(clickedChart);
  $("#" + clickedChart + "Div").remove();
};

var loadChart = function () {
  event.preventDefault();

  var searchObj = {
    symbol: $(this).attr("data-value"),
    period: "TIME_SERIES_INTRADAY"
  };
  console.log(searchObj);


  $.ajax({
    type: "POST",
    url: "/api/intrasearch",
    data: searchObj
  }).then(response => {
    console.log(response);
    const dateArr = response.dateArr;
    const closeArr = response.closeArr;
    count++;
    let currentChart = "chart" + count;

    if (dateArr.length === 1) {
      return $("#invalidSymbol").modal("show");
    }

    let $delBtn = $("<button>")
      .attr({
        class: "deleteChart mb-3",
        "data-chart": currentChart
      })
      .text("Remove " + searchObj.symbol + " Chart");
    let $chart = $("<div>").attr("id", currentChart);
    let $cDiv = $("<div>")
      .attr("id", currentChart + "Div")
      .append("<h4>" + searchObj.symbol + "</h4>")
      .append("<h5>" + moment().format("MMM Do YY") +"</h5>")
      .append($chart)
      .append($delBtn);
    $(".card-body")
      .prepend($($cDiv));
    var chart = c3.generate({
      bindto: "#" + currentChart,
      data: {
        x: "x",
        xFormat: "%Y-%m-%d %H:%M:%S",
        columns: [dateArr, closeArr]
      },
      axis: {
        x: {
          type: "timeseries",
          label: {
            text: "Today (5min)",
            position: "middle"
          },
          tick: {
            format: "%H:%M:%S"
          }
        },
        y: {
          label: {
            text: "Price",
            position: "middle"
          },
          tick: {
            format: d3.format("$,")
          }
        }
      }
    });
  });
};

reloadFavorites();

$favSubmitBtn.on("click", handleFavSubmit);
$favoriteList.on("click", ".delete", handleFavDelete);
$(document).on("click", ".stockLink", loadChart);
$(document).on("click", ".deleteChart", handleDeleteChart);