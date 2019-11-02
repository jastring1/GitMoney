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
          class:"stockLink",
          "data-value": favorite.symbol
        })
        .text(favorite.symbol);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": favorite.id,
        })
        .append($btn);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

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
    return alert("Dont leave symbol empty");
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
    period: "TIME_SERIES_DAILY_ADJUSTED"
  };

  $.ajax({
    type: "POST",
    url: "/api/livesearch",
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
      .append($chart)
      .append($delBtn);
    $(".card-body")
      .append($($cDiv));
    var chart = c3.generate({
      bindto: "#" + currentChart,
      data: {
        x: "x",
        columns: [dateArr, closeArr]
      },
      axis: {
        x: {
          type: "timeseries",
          label: {
            text: "Last 100 Days",
            position: "middle"
          },
          tick: {
            format: "%Y-%m-%d"
          }
        },
        y: {
          label: {
            text: "Closing Price",
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