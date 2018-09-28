from project import db
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from sqlalchemy import func, and_, case, event
from datetime import timedelta as td


#### Games ############################################################
#######################################################################

# Many-to-many relationships ##########################################

games_countries = db.Table('games_countries',
    db.Column('game_id', db.Integer, db.ForeignKey('games.id')),
    db.Column('country_id', db.Integer, db.ForeignKey('countries.id'))
)

cars_car_classes = db.Table('cars_car_classes',
    db.Column('car_id', db.Integer, db.ForeignKey('cars.id')),
    db.Column('car_class_id', db.Integer, db.ForeignKey('car_classes.id')),
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

    # Foreign keys
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'))

    # Relationships
    # Backrefs: game, country


class Weather(db.Model):
    __tablename__ = 'weather'

    id = db.Column(db.Integer, primary_key=True)
    conditions = db.Column(db.String, nullable=False)

    # Relationships
    # Backrefs: tracks


class Car(db.Model):
    __tablename__ = 'cars'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Backrefs: car_classes


class CarClass(db.Model):
    __tablename__ = 'car_classes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

    # Foreign keys
    cars = db.relationship('Car', secondary=cars_car_classes, backref='car_classes', lazy='dynamic')
    # Backrefs: game


class Split(db.Model):
    __tablename__ = 'splits'

    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, nullable=True)
    finished = db.Column(db.Boolean, default=False, nullable=False)

    # Foreign keys
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'))
    weather_id = db.Column(db.Integer, db.ForeignKey('weather.id'))
    stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'))

    # Relationships
    track = db.relationship('Track', lazy='joined')
    weather = db.relationship('Weather', lazy='joined')
    # Backrefs: stage

    def get_ranking(self):
        return db.session\
            .query(Player.id, Player.name, Time.time, Time.disqualified)\
            .join(Time, Time.player_id == Player.id)\
            .join(Split, Split.id == Time.split_id)\
            .join(EventPlayer, and_(
                EventPlayer.player_id == Player.id,
                EventPlayer.event_id == self.stage.event_id))\
            .filter(Split.stage_id == self.stage_id)\
            .filter(Split.id == self.id)\
            .order_by(
                case([(Time.time != None, 0),], else_=1),
                Time.time,
                case([(Time.disqualified != None, 0),], else_=1),
                EventPlayer.order)\
            .all()


    def get_progress(self):
        return db.session\
            .query(Player.id, Player.name, func.sum(Time.time), StageRanking.disqualified)\
            .join(Time, Time.player_id == Player.id)\
            .join(Split, Split.id == Time.split_id)\
            .join(StageRanking, and_(
                StageRanking.stage_id == self.stage_id,
                StageRanking.player_id == Player.id))\
            .join(EventPlayer, and_(
                EventPlayer.player_id == Player.id,
                EventPlayer.event_id == self.stage.event_id))\
            .filter(Split.stage_id == self.stage_id)\
            .filter(Split.order <= self.order)\
            .group_by(Player.id, StageRanking.disqualified, EventPlayer.player_id, EventPlayer.order)\
            .order_by(
                case([(StageRanking.disqualified == True, EventPlayer.order),], else_=0),
                func.sum(Time.time),
                EventPlayer.order)\
            .all()


    def get_previous(self):
        return Split.query\
            .filter(Split.stage_id == self.stage_id)\
            .filter(Split.order == self.order - 1)\
            .first()


class Time(db.Model):
    __tablename__ = 'times'

    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.Interval, nullable=True)
    disqualified = db.Column(db.Boolean, nullable=True)

    # Foreign keys
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    split_id = db.Column(db.Integer, db.ForeignKey('splits.id'))

    player = db.relationship('Player', lazy='joined')
    split = db.relationship('Split', lazy='joined', backref='times')
    # Backrefs: player


#### Events ###########################################################
#######################################################################

# Many-to-many relationships ##########################################

class EventPlayer(db.Model):
    __tablename__ = 'events_players'

    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), primary_key=True)
    order = db.Column(db.Integer, nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'))
    points = db.Column(db.Integer, nullable=False, default=0)

    # Relationships
    car = db.relationship('Car')


class StageRanking(db.Model):
    __tablename__ = 'stages_rankings'

    stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'), primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), primary_key=True)
    time_total = db.Column(db.Interval, nullable=False, default=td())
    points = db.Column(db.Integer, nullable=False, default=0)
    disqualified = db.Column(db.Boolean, nullable=False, default=False)

    # Relationships
    player = db.relationship('Player')


events_car_classes = db.Table('events_car_classes',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id')),
    db.Column('car_class_id', db.Integer, db.ForeignKey('car_classes.id'))
)


# Tables ##############################################################

class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Relationships
    times = db.relationship('Time', lazy='dynamic')
    events = db.relationship('EventPlayer', backref='player', lazy='dynamic')


class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

    # Relationships
    game = db.relationship('Game')
    car_classes = db.relationship('CarClass', secondary=events_car_classes)
    event_players = db.relationship('EventPlayer', backref='event', lazy='dynamic')
    stages = db.relationship('Stage', backref='event', lazy='dynamic')

    def get_car_classes(self):
        return [[cc.id, cc.name] for cc in self.car_classes]


    def get_players(self):
        return db.session\
            .query(
                Player.id,
                Player.name,
                EventPlayer.order,
                EventPlayer.points,
                Car.id,
                Car.name)\
            .join(EventPlayer, and_(
                EventPlayer.event_id == self.id,
                EventPlayer.player_id == Player.id))\
            .join(Car, Car.id == EventPlayer.car_id)\
            .order_by(
                EventPlayer.points,
                EventPlayer.order)\
            .all()


    def get_stages(self):
        return db.session\
            .query(
                Stage.id,
                Country.name,
                Stage.finished,
                Stage.order)\
            .join(Country, Country.id == Stage.country_id)\
            .filter(Stage.event_id == self.id)\
            .order_by(Stage.order)\
            .all()


class Stage(db.Model):
    __tablename__ = 'stages'

    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'))
    finished = db.Column(db.Boolean, nullable=False, default=False)

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
                StageRanking.time_total,
                StageRanking.points,
                StageRanking.disqualified)\
            .join(StageRanking, StageRanking.player_id == Player.id)\
            .join(EventPlayer, EventPlayer.player_id == Player.id)\
            .filter(StageRanking.stage_id == self.id)\
            .order_by(
                case([(StageRanking.disqualified, 1),], else_=0),
                StageRanking.points.desc(),
                StageRanking.time_total,
                EventPlayer.order)\
            .all()


    def get_progress(self):
        return db.session\
            .query(
                Player.id,
                Player.name,
                func.sum(StageRanking.time_total),
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
                func.sum(StageRanking.time_total),
                EventPlayer.order)\
            .all()


    def get_previous(self):
        return Stage.query\
            .filter(Stage.event_id == self.event_id)\
            .filter(Stage.order == self.order - 1)\
            .first()
