var $submit = $("#submit");

console.log("loaded");


$(document).ready(function() {
  $("#submit").click(function() {
    $("#c3-display").show();
  });
});

var searchSubmit = () => {
  event.preventDefault();

  var searchObj = {
    symbol: $("#symbolInput").val().trim(),
    period: $("#periodSelect :selected").val()
  };

  if (searchObj.symbol === "") {
    return $("#emptyInput").modal("show");
  }

  //$("#symbolInput").val("");

  $.ajax({
    type: "POST",
    url: "/api/livesearch",
    data: searchObj
  }).then(response => {
    console.log(response);
    const dateArr = response.dateArr;
    const closeArr = response.closeArr;

    if (dateArr.length === 1) {
      return $("#invalidSymbol").modal("show");
    }

    $("#chart").empty();
    $("#stockNameHeader").empty();
    $("#stockNameHeader").append("<h4>Results for Stock: " + searchObj.symbol.toUpperCase() + "<h4>");
    $("thead").empty();
    $("thead")
      .append("<th scope='col'>Date</th>")
      .append("<th scope='col'>Open($)</th>")
      .append("<th scope='col'>High($)</th>")
      .append("<th scope='col'>Low($)</th>")
      .append("<th scope='col'>Close($)</th>")
      .append("<th scope='col'>Volume</th>");
    $("tbody").empty();

    response.keyPair.forEach(el => {
      let dateTd = $("<td>").text(el.date);
      let openTd = $("<td>").text(el.open);
      let highTd = $("<td>").text(el.high);
      let lowTd = $("<td>").text(el.low);
      let closeTd = $("<td>").text(el.close);
      let volumeTd = $("<td>").text(el.volume);
      let newRow = $("<tr>")
        .append(dateTd)
        .append(openTd)
        .append(highTd)
        .append(lowTd)
        .append(closeTd)
        .append(volumeTd);
      $("tbody").append(newRow);
    });
    var chart = c3.generate({
      bindto: "#chart",
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

$("#emptyInput").on("shown.bs.modal", () => {
  $("#emptyInput").trigger("focus");
});

$submit.on("click", searchSubmit);

