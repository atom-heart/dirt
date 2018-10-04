from datetime import timedelta as td

from project import db
from project.models import Game, Country, Track, Player, CarClass, Car,\
                           Weather, Split, Time, Event, EventPlayer, Stage, StageRanking


print('Creating new tables...', end=' ')

# Drop all existing database tables
db.reflect()
db.drop_all()

# Create new tables
db.create_all()

# Create players
players = [
    Player(name='Filip'),
    Player(name='Michał'),
    Player(name='Radek'),
    Player(name='Dominik')
]

# Create games
games = [
    Game(name='DiRT Rally'),
    Game(name='DiRT 4')
]

# Create weather
weather = [
    Weather(conditions='Midday/Sunny'),
    Weather(conditions='Midday/Clear'),
    Weather(conditions='Afternoon/Cloudy'),
    Weather(conditions='Morning/Rain'),
    Weather(conditions='Morning/Overcast')
]

# Create countries
countries = [
    Country(name='Germany', games=games, weather=[weather[0], weather[1]]),
    Country(name='Greece', games=[games[0]], weather=[weather[1], weather[3]]),
    Country(name='New Zeland', games=[games[1]], weather=[weather[2], weather[4]])
]

# Create tracks
tracks = [
    Track(name='Flugzeugring', game=games[0], country=countries[0]),
    Track(name='Koryni Dafni', game=games[0], country=countries[1]),
    Track(name='Pepe', game=games[1], country=countries[2]),
    Track(name='Oberstein', game=games[0], country=countries[0])
]

# Create car car_classes
car_classes = [
    CarClass(name='2000s', game=games[0]),
    CarClass(name='2010s', game=games[0])
]

# Create cars
cars = [
    Car(name='Subaru Impreza 2001', car_classes=[car_classes[0]]),
    Car(name='Ford Fiesta RS Rally', car_classes=[car_classes[1]])
]

# Create splits
splits = [
    Split(track=tracks[0], weather=weather[0], order=1, turns=4),
    Split(track=tracks[3], weather=weather[1], order=2, turns=4),
    Split(track=tracks[1], weather=weather[3], order=1, turns=4),
]

# Create times
times = [
    Time(player=players[0], split=splits[0]),
    Time(player=players[1], split=splits[0]),
    Time(player=players[0], split=splits[1]),
    Time(player=players[1], split=splits[1]),
    Time(player=players[0], split=splits[2]),
    Time(player=players[1], split=splits[2]),
    Time(player=players[2], split=splits[0]),
    Time(player=players[2], split=splits[1]),
    Time(player=players[2], split=splits[2]),
    Time(player=players[3], split=splits[1]),
    Time(player=players[3], split=splits[0]),
    Time(player=players[3], split=splits[2]),
]

# Create event
event = Event(name='Kentish Town Cup 2018', game=games[0], car_classes=car_classes)

event_players = [
    EventPlayer(order=2, car=cars[1]),
    EventPlayer(order=1, car=cars[0]),
    EventPlayer(order=3, car=cars[1]),
    EventPlayer(order=4, car=cars[0])
]

event_players[0].player = players[0]
event_players[1].player = players[1]
event_players[2].player = players[2]
event_players[3].player = players[3]

event.event_players.extend(event_players)

# Create stages
stages = [
    Stage(order=1, event=event, country=countries[0], splits=splits[:2], total_splits=2),
    Stage(order=2, event=event, country=countries[1], splits=splits[2:3], total_splits=1)
]

# Create stage ranking
stage_rankings = [
    StageRanking(),
    StageRanking(),
    StageRanking(),
    StageRanking(),
    StageRanking(),
    StageRanking(),
    StageRanking(),
    StageRanking()
]

stage_rankings[0].player = players[0]
stage_rankings[1].player = players[1]
stage_rankings[2].player = players[2]
stage_rankings[3].player = players[3]
stage_rankings[4].player = players[0]
stage_rankings[5].player = players[1]
stage_rankings[6].player = players[2]
stage_rankings[7].player = players[3]

stages[0].stage_ranking.extend(stage_rankings[:4])
stages[1].stage_ranking.extend(stage_rankings[4:8])

# Add to database
db.session.add_all(players)
db.session.add_all(games)
db.session.add_all(weather)
db.session.add_all(countries)
db.session.add_all(tracks)
db.session.add_all(car_classes)
db.session.add_all(cars)
db.session.add_all(splits)
db.session.add_all(times)
db.session.add_all(event_players)
db.session.add(event)
db.session.add_all(stages)
db.session.add_all(stage_rankings)
db.session.commit()

print("Done!")
