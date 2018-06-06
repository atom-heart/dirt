from project import db


class Player(db.Model):
    __tablename__ = 'players'

    playerId = db.Column(db.Integer, primary_key=True)
    playerName = db.Column(db.String, nullable=False)


class Event(db.Model):
    __tablename__ = 'events'

    eventId = db.Column(db.Integer, primary_key=True)
    eventName = db.Column(db.String, nullable=False)
