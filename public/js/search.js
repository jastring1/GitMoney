var $submit = $("#submit");

console.log("loaded");

var searchSubmit = () => {
  event.preventDefault();

  var symbol = $("#symbolInput")
    .val()
    .trim();

  if (symbol === "") {
    // return alert("Please enter a symbol");
    return $("#emptyInput").modal("show");
  }
  $("#symbolInput").val("");

  $.ajax("/api/search/" + symbol).then(response => {
    $("#stockNameHeader").append("<h3>Results for stock: " + symbol.toUpperCase() + "<h3>");
    const dateArr = response.dateArr;
    const closeArr = response.closeArr;
    console.log(response);
    response.keyPair.forEach(el => {
      var dateTd = $("<td>").text(el.date);
      var closeTd = $("<td>").text(el.close);
      var newRow = $("<tr>")
        .append(dateTd)
        .append(closeTd);
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
            values: [
              dateArr[2],
              dateArr[26],
              dateArr[51],
              dateArr[76],
              dateArr[100]
            ]
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
