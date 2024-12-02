$(document).ready(function () {
  // Check if API is live
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  // Ariel: Put the 1-hbnb.js functions here
  // Needs to be checked:Ariel
  const amenityDict = {};
  // if checkbox is checked add to dictionary
  $("#checkbox").on("input", function() {
    if ($(this).is(":checked")) {
      // Ariel: go back and see if this is missing something
      // needs to store k,v to dict
      amenityDict[$(this).attr('id')] = $(this).value();
    // delete amenity if not checked
    } else {
        delete amenityDict[$(this).attr('id')];
    }
    // will come back to this, adding variable to show dict
    const amenityList = Object.values(amenityDict).join(', ');
    console.log(amenityList);
  });
});
