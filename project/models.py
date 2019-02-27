from project import db
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from sqlalchemy import func, and_, case, event, or_
from datetime import timedelta as td
from datetime import datetime

from pprint import pprint


#### Games ############################################################
#######################################################################

# Many-to-many relationships ##########################################

games_countries = db.Table('games_countries',
    db.Column('game_id', db.Integer, db.ForeignKey('games.id')),
    db.Column('country_id', db.Integer, db.ForeignKey('countries.id'))
)

countries_weather = db.Table('countries_weather',
    db.Column('country_id', db.Integer, db.ForeignKey('countries.id')),
    db.Column('weather_id', db.Integer, db.ForeignKey('weather.id'))
)


# Tables ##############################################################

class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Relationships
    countries = db.relationship('Country', secondary=games_countries, backref='games', lazy='dynamic')
    tracks = db.relationship('Track', backref='game', lazy='dynamic')
    car_classes = db.relationship('CarClass', backref='game', lazy='dynamic')


class Country(db.Model):
    __tablename__ = 'countries'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Relationships
    tracks = db.relationship('Track', backref='country', lazy='dynamic')
    weather = db.relationship('Weather', secondary=countries_weather, backref='countries', lazy='dynamic')
    # Backrefs: games


class Track(db.Model):
    __tablename__ = 'tracks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    length = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String, nullable=True)

    # Foreign keys
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'))

    # Relationships
    # Backrefs: game, country


class Weather(db.Model):
    __tablename__ = 'weather'

    id = db.Column(db.Integer, primary_key=True)
    conditions = db.Column(db.String, nullable=False)
    favorable = db.Column(db.Boolean, nullable=False, default=True)

    # Relationships
    # Backrefs: tracks


class Car(db.Model):
    __tablename__ = 'cars'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    car_class_id = db.Column(db.Integer, db.ForeignKey('car_classes.id'))

    # Backrefs: car_classes


class CarClass(db.Model):
    __tablename__ = 'car_classes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

    # Foreign keys
    cars = db.relationship('Car', backref='car_class', lazy='dynamic')
    # Backrefs: game


class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Relationships
    times = db.relationship('Time', lazy='dynamic')
    events = db.relationship('EventPlayer', backref='player', lazy='dynamic')



#### Events ###########################################################
#######################################################################

# Many-to-many relationships ##########################################

class EventPlayer(db.Model):
    __tablename__ = 'event_players'

    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), primary_key=True)
    order = db.Column(db.Integer, nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'))

    __table_args__ = (db.PrimaryKeyConstraint(player_id, event_id),)

    # Relationships
    car = db.relationship('Car')


class StageRanking(db.Model):
    __tablename__ = 'stage_rankings'

    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), primary_key=True)
    stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'), primary_key=True)
    disqualified = db.Column(db.Boolean, nullable=False, default=False)
    points = db.Column(db.Integer, nullable=False, default=0)

    __table_args__ = (db.PrimaryKeyConstraint(player_id, stage_id),)

    # Relationships
    player = db.relationship('Player')


events_car_classes = db.Table('events_car_classes',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id')),
    db.Column('car_class_id', db.Integer, db.ForeignKey('car_classes.id'))
)


# Tables ##############################################################

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    finished = db.Column(db.Boolean, nullable=False, default=False)
    start = db.Column(db.DateTime, nullable=False, default=datetime.now())
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

    # Relationships
    game = db.relationship('Game')
    car_classes = db.relationship('CarClass', secondary=events_car_classes)
    event_players = db.relationship('EventPlayer', backref='event', lazy='dynamic')
    stages = db.relationship('Stage', backref='event', lazy='dynamic')


    def get_ranking(self):
        return db.session.query(
                Player.id,
                Player.name,
                func.sum(StageRanking.points),
                Car.name)\
            .join(Stage, Stage.event_id == self.id)\
            .join(StageRanking, and_(
                StageRanking.player_id == Player.id,
                StageRanking.stage_id == Stage.id))\
            .join(EventPlayer, and_(
                EventPlayer.player_id == Player.id,
                EventPlayer.event_id == self.id))\
            .join(Car, Car.id == EventPlayer.car_id)\
            .group_by(
                Player.id,
                Player.name,
                Car.name,
                EventPlayer.order)\
            .order_by(
                func.sum(StageRanking.points).desc(),
                EventPlayer.order)\
            .all()


    def get_car_classes(self):
        return [[cc.id, cc.name] for cc in self.car_classes]


    def get_players(self):
        return db.session.query(
                Player.id,
                Player.name,
                EventPlayer.order,
                Car.id,
                Car.name)\
            .join(EventPlayer, and_(
                EventPlayer.event_id == self.id,
                EventPlayer.player_id == Player.id))\
            .join(Car, Car.id == EventPlayer.car_id)\
            .order_by(EventPlayer.order)\
            .all()


    def get_stages(self):
        return db.session.query(
                Stage.id,
                Country.name.label('country'),
                Stage.finished,
                Stage.order,
                Stage.last_in_event)\
            .join(Country, Country.id == Stage.country_id)\
            .filter(Stage.event_id == self.id)\
            .order_by(Stage.order)\
            .all()


    def should_finish(self):
        return db.session.query(func.count(Stage.id))\
            .filter(Stage.event_id == self.id)\
            .filter(Stage.finished.isnot(True))\
            .first()[0] == 0


class Stage(db.Model):
    __tablename__ = 'stages'

    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, nullable=False)
    finished = db.Column(db.Boolean, nullable=False, default=False)
    last_in_event = db.Column(db.Boolean, nullable=False, default=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'))

    # Relationships
    country = db.relationship('Country')
    splits = db.relationship('Split', backref='stage', lazy='dynamic')
    stage_ranking = db.relationship('StageRanking', backref='stage', lazy='dynamic')
    # Backrefs: event


    def get_ranking(self):
        return db.session\
            .query(
                Player.id,
                Player.name,
                func.sum(Time.time),
                StageRanking.points,
                StageRanking.disqualified)\
            .join(StageRanking, and_(
                StageRanking.player_id == Player.id,
                StageRanking.stage_id == self.id))\
            .join(EventPlayer, and_(
                EventPlayer.event_id == self.event_id,
                EventPlayer.player_id == Player.id))\
            .join(Split, Split.stage_id == self.id)\
            .join(Time, and_(
                Time.split_id == Split.id,
                Time.player_id == Player.id))\
            .group_by(
                Player.id,
                Player.name,
                StageRanking.points,
                StageRanking.disqualified,
                EventPlayer.order)\
            .order_by(
                case([(StageRanking.disqualified, 1)], else_=0),
                StageRanking.points.desc(),
                func.sum(Time.time),
                EventPlayer.order)\
            .all()


    def get_progress(self):
        return db.session.query(
                Player.id,
                Player.name,
                func.sum(StageRanking.points))\
            .join(Stage, Stage.event_id == self.event_id)\
            .join(StageRanking, and_(
                StageRanking.player_id == Player.id,
                StageRanking.stage_id == Stage.id))\
            .join(EventPlayer, and_(
                EventPlayer.player_id == Player.id,
                EventPlayer.event_id == self.event_id))\
            .filter(Stage.order <= self.order)\
            .group_by(Player.id, Player.name, EventPlayer.order)\
            .order_by(
                func.sum(StageRanking.points).desc(),
                EventPlayer.order)\
            .all()


    def get_previous(self):
        return Stage.query\
            .filter(Stage.event_id == self.event_id)\
            .filter(Stage.order == self.order - 1)\
            .first()


    def should_finish(self):
        splits_not_finished = list(filter(lambda s: not s.finished, self.splits.all()))
        return len(splits_not_finished) == 0


class Split(db.Model):
    __tablename__ = 'splits'

    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, nullable=True)
    finished = db.Column(db.Boolean, default=False, nullable=False)
    active = db.Column(db.Boolean, default=False, nullable=False)
    last_in_stage = db.Column(db.Boolean, nullable=False, default=False)

    # Foreign keys
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'))
    weather_id = db.Column(db.Integer, db.ForeignKey('weather.id'))
    stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'))

    # Relationships
    track = db.relationship('Track', lazy='joined')
    weather = db.relationship('Weather', lazy='joined')
    times = db.relationship('Time', lazy='dynamic', backref='split')
    # Backrefs: stage


    def get_ranking(self):
        return db.session.query(
                Player.id,
                Player.name,
                Time.id,
                Time.time,
                Time.disqualified,
                StageRanking.disqualified)\
            .join(Time, Time.player_id == Player.id)\
            .join(Split, Split.id == Time.split_id)\
            .join(EventPlayer, and_(
                EventPlayer.player_id == Player.id,
                EventPlayer.event_id == self.stage.event_id))\
            .join(StageRanking, and_(
                StageRanking.player_id == Player.id,
                StageRanking.stage_id == self.stage_id))\
            .filter(Split.stage_id == self.stage_id)\
            .filter(Split.id == self.id)\
            .order_by(
                case([(Time.time.isnot(None), 0),], else_=1),
                Time.time,
                case([(Time.disqualified == True, 0),
                    (StageRanking.disqualified == True, 1)],
                    else_=2),
                EventPlayer.order)\
            .all()


    def get_progress(self):
        x = db.session.query(
                Player.id,
                Player.name,
                case([(func.sum(case([(Time.time.isnot(None), 1)], else_=0)) == self.order, func.sum(Time.time))], else_=None),
                case([(func.sum(case([(Time.disqualified == True, 1),], else_=0)) > 0, True),], else_=False))\
            .join(Time, Time.player_id == Player.id)\
            .join(Split, Split.id == Time.split_id)\
            .join(EventPlayer, and_(
                EventPlayer.player_id == Player.id,
                EventPlayer.event_id == self.stage.event_id))\
            .filter(Split.stage_id == self.stage_id)\
            .filter(Split.order <= self.order)\
            .group_by(Player.id, EventPlayer.player_id, EventPlayer.order)\
            .order_by(
                case([(case([(func.sum(case([(Time.time.isnot(None), 1)], else_=0)) == self.order, func.sum(Time.time))], else_=None).isnot(None), 0)], else_=1),
                case([(func.sum(case([(Time.time.isnot(None), 1)], else_=0)) == self.order, func.sum(Time.time))], else_=None),
                case([(case([(func.sum(case([(Time.disqualified == True, 1),], else_=0)) > 0, True),], else_=False) == True, 0)], else_=1),
                EventPlayer.order)\
            .all()

        pprint(x)

        return x

        return db.session.query(
                Player.id,
                Player.name,
                func.sum(Time.time),
                case([(func.sum(case([(Time.disqualified == True, 1),], else_=0)) > 0, True),], else_=False),
                func.count(case([(Time.time.isnot(None), 1)], else_=0)))\
            .join(Time, Time.player_id == Player.id)\
            .join(Split, Split.id == Time.split_id)\
            .join(EventPlayer, and_(
                EventPlayer.player_id == Player.id,
                EventPlayer.event_id == self.stage.event_id))\
            .filter(Split.stage_id == self.stage_id)\
            .filter(Split.order <= self.order)\
            .group_by(Player.id, EventPlayer.player_id, EventPlayer.order)\
            .order_by(
                case([(case([(func.sum(case([(Time.disqualified == True, 1),], else_=0)) > 0, True),], else_=False) == True, 1),], else_=0),
                func.sum(Time.time),
                EventPlayer.order)\
            .all()


    def get_previous(self):
        return Split.query\
            .filter(Split.stage_id == self.stage_id)\
            .filter(Split.order == self.order - 1)\
            .first()


    def should_finish(self):
        turns = self.times.all()
        finished_turns = list(filter(lambda turn: turn.time, turns))
        disq_count = db.session.query(func.count(StageRanking.player_id))\
            .filter(StageRanking.stage_id == self.stage_id)\
            .filter(StageRanking.disqualified)\
            .first()[0]

        return len(turns) == len(finished_turns) + disq_count


class Time(db.Model):
    __tablename__ = 'times'

    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.Interval, nullable=True)
    disqualified = db.Column(db.Boolean, nullable=True)

    # Foreign keys
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    split_id = db.Column(db.Integer, db.ForeignKey('splits.id'))

    player = db.relationship('Player', lazy='joined')
    # Backrefs: player
