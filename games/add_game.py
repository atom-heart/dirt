import json

from project import db
from project.models import Game, Country, Weather, Track, CarClass, Car


def commit(entity):
    db.session.add(entity)
    db.session.commit()

def get_weather(conditions):
    return Weather.query.filter(Weather.conditions == conditions).first()

# Open json file
with open('games/dirt_rally.json') as game_file:
    data = json.load(game_file)

# Create a game
_game = Game(name=data['game']['name'])
commit(_game)


# Countries
countries = data['game']['countries']

for country in countries:
    # Weather
    _ctr_weather = []

    weathers = countries[country]['weather']

    for weather in weathers:
        _weather = get_weather(weather['conditions'])

        if not _weather:
            _weather = Weather(
                conditions=weather['conditions'],
                favorable=weather['favorable']
            )
            commit(_weather)

        _ctr_weather.append(_weather)

    # Country itself
    _country = Country(name=country, games=[_game], weather=_ctr_weather)
    commit(_country)


    # Tracks
    tracks = countries[country]['tracks']

    for track in tracks:
        _track = Track(
            name=track['name'],
            length=track['length'],
            type=track['type'],
            country=_country,
            game=_game
        )

        commit(_track)


# Cars
cars = data['game']['cars']

for car_class in cars:
    _car_class = CarClass(name=car_class, game=_game)
    commit(_car_class)

    for car in cars[car_class]:
        _car = Car(name=car, car_class=_car_class)
        commit(_car)
