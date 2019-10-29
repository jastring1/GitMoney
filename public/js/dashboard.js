var $favSubmitBtn = $("#favoriteSubmit");

const handleFavSubmit = event => {
  event.preventDefault();
  console.log("clicked");

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
    // headers: {
    //   "Content-type": "applicant/json"
    // },
    type: "POST",
    url: "/api/favorites",
    data: favorite
  });
};

$favSubmitBtn.on("click", handleFavSubmit);
