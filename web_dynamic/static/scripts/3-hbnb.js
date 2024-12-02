$(document).ready(function () {
  // Create an object to store selected amenities
  const selectedAmenities = {};

  // Listen for changes on input checkboxes inside the amenities popover
  $('div.amenities input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id'); // Get Amenity ID
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

  // Check API status
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Fetch and display places
  fetchPlaces();

  function fetchPlaces (filters = {}) {
    // Send POST request to the API
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters), // Send filters as the request body
      success: function (places) {
        // Clear existing places
        $('section.places').empty();

        // Loop through each place and append its HTML to the section
        for (const place of places) {
          const placeHtml = `
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">
                ${place.description}
              </div>
            </article>`;
          $('section.places').append(placeHtml);
        }
      },
      error: function (error) {
        console.error('Error fetching places:', error);
      }
    });
  }

  // Add a "Search" button functionality to filter places
  $('button').click(function () {
    const filters = {
      amenities: Object.keys(selectedAmenities)
    };
    fetchPlaces(filters);
  });
});
