from project import db as _db
from project import app as _app
from project import instance_path
from project.models import Player, Game, Weather, Country, Car, CarClass, Event, Split, Track, Time, Stage, StageRanking, EventPlayer
from project.filters import timefilter

from datetime import timedelta as td

import pytest


@pytest.fixture(scope='module')
def app(request):
    # `TESTING` set to True, `DEBUG` to False,
    # `SQLALCHEMY_DATABASE_URI` leading to testing postgres database
    _app.config.from_pyfile('testing_config.py')
    # Not using SQLite for testing, because there are problems with
    # summing timedelta. 

    test_client = _app.test_client()

    ctx = _app.app_context()
    ctx.push()

    def teardown():
        ctx.pop()

    request.addfinalizer(teardown)
    return test_client


@pytest.fixture(scope='module')
def db(request):
    _db.create_all()

    def teardown():
        _db.session.close()
        _db.drop_all()

    request.addfinalizer(teardown)
    return _db


@pytest.fixture(scope='module')
def game1():
    game1 = Game(name='DiRT Rally')
    car_class1 = CarClass(name='2000s', game=game1)
    car1 = Car(name='Subaru Impreza 2001', car_classes=[car_class1])
    weather1 = Weather(conditions='It\'s Always Sunny')
    country1 = Country(name='Philadelphia', games=[game1], weather=[weather1])
    track1 = Track(name='Pepe Silvia', game=game1, country=country1)
    track2 = Track(name='Ongo Goblogian', game=game1, country=country1)

    player1 = Player(name='Filip')
    player2 = Player(name='Michał')
    player3 = Player(name='Dominik')

    tables = [
        game1, car_class1, car1, weather1, country1, track1, track2,
        player1, player2, player3
    ]

    _db.session.add_all(tables)
    _db.session.commit()


@pytest.fixture(scope='module')
def event1():
    car_class1 = CarClass.query.get(1)
    event1 = Event(name='XD', game_id=1, car_classes=[car_class1])

    ep1 = EventPlayer(order=3, car_id=1, player_id=1)
    ep2 = EventPlayer(order=2, car_id=1, player_id=2)
    ep3 = EventPlayer(order=1, car_id=1, player_id=3)
    event1.event_players.extend([ep1, ep2, ep3])

    _db.session.add(event1)
    _db.session.commit()


@pytest.fixture(scope='module')
def stage1():
    stage1 = Stage(order=1, event_id=1, country_id=1)

    sr1 = StageRanking(player_id=1, stage_id=1)
    sr2 = StageRanking(player_id=2, stage_id=1)
    sr3 = StageRanking(player_id=3, stage_id=1)
    stage1.stage_ranking.extend([sr1, sr2, sr3])

    split1 = Split(stage_id=1, track_id=1, weather_id=1, order=1)
    time1_1 = Time(player_id=1, split=split1)
    time1_2 = Time(player_id=2, split=split1)
    time1_3 = Time(player_id=3, split=split1)

    split2 = Split(stage_id=1, track_id=1, weather_id=1, order=2)
    time2_1 = Time(player_id=1, split=split2)
    time2_2 = Time(player_id=2, split=split2)
    time2_3 = Time(player_id=3, split=split2)

    tables = [
        stage1, sr1, sr2, sr3,
        split1, time1_1, time1_2, time1_3,
        split2, time2_1, time2_2, time2_3
    ]

    _db.session.add_all(tables)
    _db.session.commit()


@pytest.fixture(scope='module')
def stage2():
    stage2 = Stage(order=2, event_id=1, country_id=1)

    sr1 = StageRanking(player_id=1, stage_id=2)
    sr2 = StageRanking(player_id=2, stage_id=2)
    sr3 = StageRanking(player_id=3, stage_id=2)
    stage2.stage_ranking.extend([sr1, sr2, sr3])

    _db.session.add(stage2)
    _db.session.commit()
