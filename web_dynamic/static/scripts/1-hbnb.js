// DOM ready
$(document).ready(function () {
  // Create empty dictionary to store selected amenities
  const amenityDict = {};

  // Listen for changes on input checkbox tags
  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');   // Get Amenity ID
    const amenityName = $(this).attr('data-name'); // Get Amenity Name

    if ($(this).is(':checked')) {
      // Add amenity to dictionary
      amenityDict[amenityId] = amenityName;
    } else {
      // Remove amenity from dictionary
      delete amenityDict[amenityId];
    }

    // Update the h4 tag inside div.filters
    const amenityList = Object.values(amenityDict).join(', '); // Get selected names
    $('div.filters h4').text(amenityList || '\xa0'); // Update h4 (non-breaking space if empty)
  });
});
