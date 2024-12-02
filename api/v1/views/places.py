#!/usr/bin/python3
"""
This module provides RESTful API actions for Place objects.
It includes routes to retrieve, create, delete, and update places.
"""

from flask import jsonify, abort, request
from api.v1.views import app_views
from models import storage
from models.city import City
from models.place import Place
from models.user import User


@app_views.route('/cities/<city_id>/places', methods=['GET'])
def get_places_by_city(city_id):
    """Retrieves the list of all Place objects of a City."""
    city = storage.get(City, city_id)
    if not city:
        abort(404)
    places = [place.to_dict() for place in city.places]
    return jsonify(places)


@app_views.route('/places/<place_id>', methods=['GET'])
def get_place(place_id):
    """Retrieves a specific Place by ID."""
    place = storage.get(Place, place_id)
    if not place:
        abort(404)
    return jsonify(place.to_dict())


@app_views.route('/places/<place_id>', methods=['DELETE'])
def delete_place(place_id):
    """Deletes a Place by ID."""
    place = storage.get(Place, place_id)
    if not place:
        abort(404)
    storage.delete(place)
    storage.save()
    return jsonify({}), 200


@app_views.route('/cities/<city_id>/places', methods=['POST'])
def create_place(city_id):
    """Creates a new Place under a specific City."""
    city = storage.get(City, city_id)
    if not city:
        abort(404)
    if not request.is_json:
        abort(400, description="Not a JSON")

    data = request.get_json(silent=True)
    if data is None:
        abort(400, description="Not a JSON")
    if 'user_id' not in data:
        abort(400, description="Missing user_id")
    if 'name' not in data:
        abort(400, description="Missing name")

    user = storage.get(User, data['user_id'])
    if not user:
        abort(404)

    new_place = Place(
        name=data['name'], city_id=city_id, user_id=data['user_id']
        )
    for key, value in data.items():
        if key not in ['id', 'user_id', 'city_id', 'created_at', 'updated_at']:
            setattr(new_place, key, value)

    storage.new(new_place)
    storage.save()
    return jsonify(new_place.to_dict()), 201


@app_views.route('/places/<place_id>', methods=['PUT'])
def update_place(place_id):
    """Updates a Place by ID."""
    place = storage.get(Place, place_id)
    if not place:
        abort(404)

    data = request.get_json(silent=True)
    if not data:
        abort(400, description="Not a JSON")

    for key, value in data.items():
        if key not in ['id', 'user_id', 'city_id', 'created_at', 'updated_at']:
            setattr(place, key, value)

    storage.save()
    return jsonify(place.to_dict()), 200

@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
def search_places():
    """
    Retrieves all Place objects based on JSON filters in the request body.
    - Filters can include 'states', 'cities', and 'amenities'.
    """
    if not request.is_json:
        abort(400, description="Not a JSON")

    data = request.get_json(silent=True)
    if data is None:
        abort(400, description="Not a JSON")

    # John:Retrieve all Place objects if no filters are provided
    if not data or (
        'states' not in data and 'cities' not in data and 'amenities' not in data
    ):
        all_places = storage.all(Place).values()
        return jsonify([place.to_dict() for place in all_places])

    places = set()

    # John: Retrieve places by states
    if 'states' in data and data['states']:
        state_ids = data['states']
        for state_id in state_ids:
            state = storage.get("State", state_id)
            if state:
                for city in state.cities:
                    places.update(city.places)

    # John: Retrieve places by cities
    if 'cities' in data and data['cities']:
        city_ids = data['cities']
        for city_id in city_ids:
            city = storage.get("City", city_id)
            if city:
                places.update(city.places)

    # John; Filter by amenities
    if 'amenities' in data and data['amenities']:
        amenity_ids = set(data['amenities'])
        filtered_places = set()
        for place in places:
            place_amenity_ids = {amenity.id for amenity in place.amenities}
            if amenity_ids.issubset(place_amenity_ids):
                filtered_places.add(place)
        places = filtered_places

    # John; Convert Place objects to dictionaries
    return jsonify([place.to_dict() for place in places])
