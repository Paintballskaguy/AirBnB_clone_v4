$(document).ready(function () {
  // Create an object to store selected amenities
  const selectedAmenities = {};

  // Listen for changes on input checkboxes inside the amenities popover
  $('div.amenities input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');   // Get Amenity ID
    const amenityName = $(this).attr('data-name'); // Get Amenity Name

    if ($(this).is(':checked')) {
      // Add the amenity to the dictionary if checked
      selectedAmenities[amenityId] = amenityName;
    } else {
      // Remove the amenity from the dictionary if unchecked
      delete selectedAmenities[amenityId];
    }

    // Update the h4 tag inside div.amenities with the selected amenities
    const amenitiesList = Object.values(selectedAmenities).join(', ');
    $('div.amenities h4').text(amenitiesList || '\xa0'); // Clear text if no amenities selected
  });

  $.get(`http://0.0.0.0:5001/api/v1/status/`, function(data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});
