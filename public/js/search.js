var $submit = $("#submit");

console.log("loaded");

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
  $("#chart").empty();
  $("#stockNameHeader").empty();

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

    $("#stockNameHeader").append("<h3>Results for Stock: " + searchObj.symbol.toUpperCase() + "<h3>");
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
