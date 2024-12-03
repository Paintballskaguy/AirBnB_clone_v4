$(document).ready(function () {
    // Object to store selected amenities
    const selectedAmenities = {};
  
    // Listen for changes on input checkboxes in the amenities section
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
  
      // Update the h4 tag with the selected amenities list
      const amenitiesList = Object.values(selectedAmenities).join(', ');
      $('div.amenities h4').text(amenitiesList || '\xa0'); // Clear text if no amenities selected
    });
  
    // Check API status and update indicator
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    // Fetch and display all places on page load
    fetchPlaces();
  
    // Add "Search" button functionality to filter places
    $('button').click(function () {
      const filters = { amenities: Object.keys(selectedAmenities) }; // Collect selected amenities
      fetchPlaces(filters); // Fetch places with filters
    });
  
    // Function to fetch and display places
    function fetchPlaces(filters = {}) {
      // Send POST request to the API
      fetch('http://0.0.0.0:5001/api/v1/places_search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters), // Send filters as the request body
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(places => {
          const placesSection = $('section.places');
          placesSection.empty(); // Clear existing places
  
          if (places.length === 0) {
            placesSection.append('<p>No places found.</p>');
            return;
          }
  
          // Loop through each place and append its HTML
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
            placesSection.append(placeHtml);
          }
        })
        .catch(error => {
          console.error('Error fetching places:', error);
          $('section.places').html('<p>Unable to load places. Please try again later.</p>');
        });
    }
  });
  