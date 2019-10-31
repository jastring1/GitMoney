var $favSubmitBtn = $("#favoriteSubmit");
var $favoriteList = $("#favoriteList");

const reloadFavorites = () => {
  $.ajax({
    url: "/api/favorites",
    type: "GET"
  }).then(data => {
    var $favorites = data.map(function(favorite) {
      var $a = $("<a>").text(favorite.symbol);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": favorite.id
        })
        .append($a);

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

var handleFavDelete = function() {
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

reloadFavorites();

$favSubmitBtn.on("click", handleFavSubmit);
$favoriteList.on("click", ".delete", handleFavDelete);
