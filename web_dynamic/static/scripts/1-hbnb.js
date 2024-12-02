// DOM launched
$(document).ready(function() {
  // create empty dictionary
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