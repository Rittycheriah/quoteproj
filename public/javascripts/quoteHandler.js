$(document).ready(function() {

  // User clicked on an edit button
  $(".editButton").click(function () {
    console.log("edit button")
    window.location.href = "/quotes/edit/" + $(this)[0].id;
  });

  // User clicked on a delete button
  $(".deleteButton").click(function () {
    console.log("delete button")
    var quoteItemId = $(this)[0].id;

console.log(quoteItemId);
    $.ajax({
      url: "/quotes",
      method: "DELETE",
      data: {
        quote_id: quoteItemId
      },
      success: function (response) {
        $("#quote_"+quoteItemId).remove();  // Remove the DOM element on success
      }
    });
  });



});
