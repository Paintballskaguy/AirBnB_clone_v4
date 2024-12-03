$(document).ready(function () {
  const selectedAmenities = {};

  // Handle checkbox changes
  $('div.amenities input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

    const amenitiesList = Object.values(selectedAmenities).join(', ');
    $('div.amenities h4').text(amenitiesList || '\xa0');
  });

  // Check API status
  $.get('http://127.0.0.1:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Fetch places on page load
  fetchPlaces();

  // Add search functionality
  $('button').click(function () {
    const filters = { amenities: Object.keys(selectedAmenities) };
    console.log('Filters being sent:', filters); // Debug log
    fetchPlaces(filters);
  });

  function fetchPlaces(filters = {}) {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (places) {
        console.log('Places received from API:', places); // Debug log

        $('section.places').empty();

        if (places.length === 0) {
          $('section.places').append('<p>No places found.</p>');
        } else {
          for (const place of places) {
            console.log('Rendering place:', place); // Debug log
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
        }
      },
      error: function (error) {
        console.error('Error fetching places:', error);
        $('section.places').empty().append('<p>Unable to load places. Please try again later.</p>');
      }
    });
  }
});
