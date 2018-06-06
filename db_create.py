from project import db
from project.models import Player, Event

print('Creating new tables...', end=' ')

# Drop all existing database tables
db.drop_all()

# Create new tables
db.create_all()

# Create players
players = []
players.append(Player(playerName='atom'))
players.append(Player(playerName='player1'))

# Create events
events = []
events.append(Event(eventName='Kentish Town Cup'))
events.append(Event(eventName='Birmigham Cup'))

# Add to database
db.session.add_all(players)
db.session.add_all(events)
db.session.commit()

print("Done!")
