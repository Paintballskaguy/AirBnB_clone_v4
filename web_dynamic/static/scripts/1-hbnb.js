$(document).ready(function () {
  // Dictionary to store selected amenities
  const selectedAmenities = {};

  // Listen for changes on input checkbox tags
  $('input[type="checkbox"]').change(function () {
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
    $('.amenities h4').text(amenitiesList || ''); // Clear text if no amenities selected
  });
});
