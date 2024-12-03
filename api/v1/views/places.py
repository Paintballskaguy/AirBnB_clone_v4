#!/usr/bin/python3
"""
This module provides RESTful API actions for Place objects.
It includes routes to retrieve, create, delete, and update places.
"""

import json
from flask import jsonify, abort, request
from api.v1.views import app_views
from models import storage
from models.city import City
from models.place import Place
from models.state import State
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

    data = request.get_json()
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

    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    for key, value in data.items():
        if key not in ['id', 'user_id', 'city_id', 'created_at', 'updated_at']:
            setattr(place, key, value)

    storage.save()
    return jsonify(place.to_dict()), 200


@app_views.route('/places_search', methods=['POST'], strict_slashes=False)
def search_places():
    """Searches for places based on JSON filters."""
    if not request.is_json:
        abort(400, description="Not a JSON")

    data = request.get_json()
    if not isinstance(data, dict):
        abort(400, description="Not a JSON")

    # Retrieve all places if no filters are provided
    if not any(data.get(key) for key in ['states', 'cities', 'amenities']):
        all_places = storage.all(Place).values()
        return jsonify([place.to_dict() for place in all_places])

    places = set()

    # Filter by states
    if 'states' in data and data['states']:
        for state_id in data['states']:
            state = storage.get(State, state_id)
            if state:
                for city in state.cities:
                    places.update(city.places)

    # Filter by cities
    if 'cities' in data and data['cities']:
        for city_id in data['cities']:
            city = storage.get(City, city_id)
            if city:
                places.update(city.places)

    # If no places were found in states or cities, retrieve all places
    if not places and not ('states' in data or 'cities' in data):
        places = set(storage.all(Place).values())

    # Filter by amenities
    if 'amenities' in data and data['amenities']:
        amenity_ids = set(data['amenities'])
        filtered_places = set()

        for place in places:
            # Ensure amenities relationship is loaded
            place_amenity_ids = {amenity.id for amenity in place.amenities}
            if amenity_ids.issubset(place_amenity_ids):
                filtered_places.add(place)

        places = filtered_places

    return jsonify([place.to_dict() for place in places])

