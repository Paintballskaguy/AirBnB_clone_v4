#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
# Ariel: cache id needs to have value of uuid4
import uuid
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()

# Ariel: updated route from hbnb to 1-hbnb
@app.route('/1-hbnb/', strict_slashes=False)
def hbnb():
    """ Renders the HBNB page with dynamic filtering """
    states = sorted(storage.all("State").values(), key=lambda state: state.name)
    amenities = sorted(storage.all("Amenity").values(), key=lambda amenity: amenity.name)
    places = sorted(storage.all("Place").values(), key=lambda place: place.name)
    cache_id = uuid.uuid4()

    return render_template(
        '1-hbnb.html',
        states=states,
        amenities=amenities,
        places=places,
        cache_id=cache_id
    )


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
