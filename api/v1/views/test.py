#!/usr/bin/python3
import sys
import os

# Add project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from models import storage
from models.place import Place

# Fetch the place by ID
place_id = '02d9a2b5-7dca-423f-8406-707bc76abf7e'
place = storage.get(Place, place_id)

if place:
    print("Place found:")
    print(f"Name: {place.name}")
    print(f"Description: {place.description}")
    print(f"Amenities: {[amenity.id for amenity in place.amenities]}")
else:
    print("Place not found.")





# SELECT * FROM places WHERE id = '02d9a2b5-7dca-423f-8406-707bc76abf7e';
