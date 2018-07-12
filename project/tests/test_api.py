from os import path
from flask import json

from unittest import TestCase
from project import app, db
from project.models import Player, Game, Weather, Country, Car, CarClass, Event, Split, Track, Time, Stage, EventPlayer

from datetime import timedelta as td


TEST_DB = 'test.db'

class EventsTests(TestCase):

    #### Setup and teardown ###########################################
    ###################################################################

    def setUp(self):
        # Ensure testing, not debug mode
        app.config['TESTING'] = True
        app.config['DEBUG'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
            path.join(app.config['BASEDIR'], TEST_DB)

        # Get instace of app test client
        self.app = app.test_client()

        # Reinitialize the database
        db.drop_all()
        db.create_all()

        # Game stuff
        game1 = Game(name='DiRT Rally')
        car_class1 = CarClass(name='2000s', game=game1)
        car1 = Car(name='Subaru Impreza 2001', car_classes=[car_class1])
        weather1 = Weather(conditions='It\'s Always Sunny')
        country1 = Country(name='Philadelphia', games=[game1], weather=[weather1])
        track1 = Track(name='Pepe Silvia', game=game1, country=country1)

        # Players
        player1 = Player(name='Filip')
        player2 = Player(name='Michał')
        player3 = Player(name='Dominik')
        player4 = Player(name='Radek')

        # Event
        event1 = Event(name='XD', game=game1, car_classes=[car_class1])

        event_player1 = EventPlayer(order=1, car=car1, player=player1)
        event_player2 = EventPlayer(order=2, car=car1, player=player2)
        event_player3 = EventPlayer(order=3, car=car1, player=player3)
        event_player4 = EventPlayer(order=4, car=car1, player=player4)

        event1.event_players.extend([
            event_player1,
            event_player2,
            event_player3,
            event_player4
        ])

        stage1 = Stage(event=event1, country=country1, order=1)
        split1 = Split(stage=stage1, track=track1, weather=weather1, order=1)

        time1_1 = Time(
            split=split1,
            player=player1,
            time=td(minutes=3, seconds=56, milliseconds=123)
        )

        time1_2 = Time(
            split=split1,
            player=player2,
            time=td(minutes=4, seconds=27, milliseconds=364)
        )

        time1_3 = Time(
            split=split1,
            player=player3,
            time=td(minutes=3, seconds=11, milliseconds=18)
        )

        time1_4 = Time(
            split=split1,
            player=player4,
            time=td(minutes=3, seconds=59, milliseconds=111)
        )

        # Add to database
        tables = [
            game1, car_class1, car1, weather1, country1, track1,
            player1, player2, player3, player4,
            event1, stage1, split1,
            time1_1, time1_2, time1_3, time1_4
        ]

        db.session.add_all(tables)
        db.session.commit()


    def tearDown(self):
        pass


    #### Tests ########################################################
    ###################################################################

    def test_split_1(self):
        """Every player finished, no disqualified"""
        response = self.app.get('api/split/1')
        json_data = json.loads(response.data)

        assert json_data['finished']
        assert not json_data['not_finished']
        assert not json_data['disqualified']


    def test_split_2(self):
        """All players except P2 finished, no disqualified"""
        # Not finished
        time1 = Time.query.get(2)
        time1.time = None
        db.session.add(time1)
        db.session.commit()

        # Test
        response = self.app.get('api/split/1')
        json_data = json.loads(response.data)

        assert json_data['finished']
        assert json_data['not_finished']
        assert not json_data['disqualified']


    def test_split_3(self):
        """P3 didn't finish, P4 disqualified, rest has finished"""
        # Not finished
        time1 = Time.query.get(3)
        time1.time = None
        db.session.add(time1)

        # Disqualified
        time2 = Time.query.get(4)
        time2.time = None
        time2.disqualified = True
        db.session.add(time2)

        db.session.commit()

        # Test
        response = self.app.get('api/split/1')
        json_data = json.loads(response.data)

        assert json_data['finished']
        assert json_data['not_finished']
        assert json_data['disqualified']
