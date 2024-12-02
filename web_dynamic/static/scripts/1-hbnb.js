$(document).ready(function () {
  // Dictionary to store selected amenities
  const selectedAmenities = {};

  // Listen for changes on input checkbox tags
  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id'); // Get Amenity ID
    const amenityName = $(this).attr('data-name'); // Get Amenity Name

    if ($(this).is(':checked')) {
      // Add the amenity to the dictionary if checked
      selectedAmenities[amenityId] = amenityName;
    } else {
      // Remove the amenity from the dictionary if unchecked
      delete selectedAmenities[amenityId];
    }

    // Format the dictionary for display
    const amenitiesText = Object.entries(selectedAmenities)
      .map(([id, name]) => `${name} (${id})`) // Display as Name (ID)
      .join(', ');

    // Update the h4 tag inside div.amenities with the dictionary content
    $('.amenities h4').text(amenitiesText || '\xa0'); // Non-breaking space if empty
  });
});
