from project import db

print('Dropping all tables...', end=' ')

# Drop all existing database tables
db.reflect()
db.drop_all()

print("Done!")
